const register = async (req,res)=>{

    const {user,pwd} = req.body;


    console.log(user);
    console.log(pwd);


    return res.status(201).json({
        message:"User created"
    });

}

export { register };