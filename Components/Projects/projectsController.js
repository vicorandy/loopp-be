const Projects = require('./projectsModel')

async function createProject (req,res){
    try {
       return res.status(201).json({message:'project added successfully'}) 
    } catch (error) {
        return res.status(500).json({message:'Something went wrong'})
    }
}


module.exports={
    createProject
}