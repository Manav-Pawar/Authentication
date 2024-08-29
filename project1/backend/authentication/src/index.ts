import express from "express"
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import cors from "cors"
const JWT_SECRET = "manav"


const prisma = new PrismaClient()
const app = express()
const port = 3001;
app.use(express.json());
app.use(cors())

const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
  // @ts-ignore
    req.user = user; // Attach user info to request object
    next();
  });
};

app.post('/signup', async (req, res) => {
  const {email,password}= req.body
  try{
    const login = await prisma.user.findFirst({
    where:{
      email:email,
      password:password
    }
  })

  if(login){
  res.status(400)
  res.json({message:`already exit`,data:login})
}

const hashedPassword = await bcrypt.hash(password, 10);

  const signup = await prisma.user.create({
    data:{
      email:email,
      // password:password
      password:hashedPassword
    }
  })
  res.status(200)
  res.json({message:`account create succesfully `,data:signup});
} catch (error) {
  console.error(error); // Log error for debugging
// @ts-ignore
  return res.status(500).json({ message: 'Internal server error',error:error.message});
}
});


app.post('/login', async (req, res) => {
  const {email,password} = req.body
  try{
  const user = await prisma.user.findFirst({
    where:{
      email:email,
    }
  })
  // @ts-ignore
  const isPasswordValid = await bcrypt.compare(password,user.password);
  if(!user && !isPasswordValid){
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = jwt.sign({userId:user?.id},JWT_SECRET)

  res.status(200).json({message:`user login succesfully`,data:user,token:token});
} catch (error) {
  console.error(error); // Log error for debugging
// @ts-ignore
  return res.status(500).json({ message: 'Internal server error',error:error.message});
}
});

app.put('/update/:id', authenticateToken, async (req, res) => {
  
  const {id} =  req.params
  const {email,password} =  req.body
  const Id = parseInt(id)
  const hashedPassword = await bcrypt.hash(password, 10);

  try{const update = await prisma.user.update({
    where:{id:Id},
    data:{
      email:email,
      password:hashedPassword
    }
  })
  res.status(200).json({
    message: 'User updated successfully',
    data: update,
  });
}catch(error){
  // @ts-ignore
  return res.status(500).json({ message: 'Internal server error',error:error.message});
}
});

app.delete('/delete/:id', authenticateToken,async (req, res) => {
  const {id} = req.params
  const Id = parseInt(id)
  const remove = await prisma.user.delete({
    where:{
      id : Id
    }
  })
  res.status(200).json({
    message: 'User removed successfully',
    data: remove,
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});