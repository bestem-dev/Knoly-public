// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import { Storage } from '@google-cloud/storage';
import multer from 'multer'
// const multer = require('multer')
import nextConnect from 'next-connect'
import { logger } from '@src/logger';


// Creates a client from a Google service account key
//const storage = new Storage({keyFilename: 'secrets/key.json'});
const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY
  }
});
const bucketName = 'knoly-pics';

// The multer middleware doesn't seem to work well with vercel
// https://stackoverflow.com/a/71799369/10181454

const multerMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 0.5 * 1024 * 1024, // no larger than 0.5mb, you can change as needed.
  },
});
const apiRoute = nextConnect({
  onError(error, req: NextApiRequest, res: NextApiResponse) {
    res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

apiRoute.use(multerMiddleware.any());

apiRoute.post(async (req: NextApiRequest & { files: any}, res: NextApiResponse) => {
  console.log("Started file upload")
  const session = await getSession({ req })
  if (session) {
    // Signed in
    console.log("Requested session")
    logger.info({"message": "File upload attempt"})
    try {
      if(!req.files) {
        res.status(400).send({
          message: 'No file uploaded'
        });
      } else {
        console.log("Got files")
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
        let file = req!.files[0];
        console.log(file)
        let filename = `${session.user.id}_${file.originalname}.${file.mimetype.split("/")[1]}`
        console.log("Uploading files")
        //Use the mv() method to place the file in upload directory (i.e. "uploads")
        await storage.bucket(bucketName).file(filename).save(file.buffer)
        
        //send response
        res.json({
            fileUrl: `https://storage.googleapis.com/knoly-pics/${filename}`
          });
      }
    }
    catch (err) {
        logger.error(err)
        res.status(500).send(err);
    }
  }
  else {
    // Not Signed in
    logger.error({message: "Unauthorized file upload attempt"})
    res.status(401)
  }
});

export default apiRoute;

// const uploadImage = async (req: NextApiRequest, res: NextApiResponse) => {
//   const session = await getSession({ req })
//   if (session) {
//     const form = new multiparty.Form();
    
//     const data: {fields?: any, files?: any, err?: any} = await new Promise((resolve, reject) => {
//       form.parse(req, function (err, fields, files) {
//         if (err) reject({ err });
//         resolve({ fields, files });
//       });
//     });
//     // Signed in
//     logger.info({"message": "File upload attempt"})

//     if (data.err) {
//       logger.error(data.err)
//       return res.status(400).send({message: "Bad Form"})
//     }
//     try {
//       if(!data.files.pictureFile) {
//         res.status(400).send({
//           message: 'No file uploaded'
//         });
//       } else {
//         let file = data.files.pictureFile[0]
//         let filename = `${session.user.address}_${file.originalFilename.split(".")[0]}.${file.headers["content-type"].split("/")[1]}`
        
//         await storage.bucket(bucketName).file(filename).
//         save(file.buffer)
  
//         //send response
//         res.json({
//             fileUrl: `https://storage.googleapis.com/knoly-pics/${filename}`
//           });
//       }
//     }
//     catch (err) {
//       logger.error(err)
//       res.status(500).send(err);
//     }
//   }
//   else {
//     // Not Signed in
//     logger.error({message: "Unauthorized file upload attempt"})
//     res.status(401)
//   }
// };

// export default uploadImage;

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};