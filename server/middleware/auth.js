import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    try {
    
        //1-recuperer le token dans le cookie
        const token = req.cookies.token;
        console.log(token);
        if(!token){
            return res.status(401).json({success:false, message:"Non autorisé. Veuillez vous connecter."})
        }
        //2-verifier le token
        const tokenDecoded = jwt.verify(token,process.env.JWT_SECRET);
        
       
        if(!tokenDecoded.id || !tokenDecoded.role){
            return res.status(401).json({success:false, message:"Non autorisé."})
        }

        req.user={
            id:tokenDecoded.id,
            role:tokenDecoded.role,
            organisation:tokenDecoded.organisation
        } 
        
        
        //5-passer au prochain middleware
        next();
    } catch (error) {
        return res.status(401).json({success:false, message:"Non autorisé."})
    }
}

export default authMiddleware;