import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema
const organisationSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
    orgID:{type:String, required:true, unique:true, trim:true},
    nom:{type:String, required:true , trim:true},
    description:{type:String, required:false},
    dateDeCreation:{type:Date, default:Date.now},
    password:{type:String, required:true},
    role:{
        type:String,
        enum:["org"]
    }
    },
    //b-ajouter les timestamps pour la creation et la modification automatisée(createdAt et updatedAt)
    {
        timestamps: true, 
    }
);

//II-ajouter le plugin du soft deleting
organisationSchema.plugin(mongooseDelete,{   
                                            deletedAt: true ,
                                            overrideMethods: 'all' // overrideMethods: 'all'pour que .find() ignore les docs supprimés
                                            }
                                            ); 

//II-creer le model composé du schema creer 
const Organisation = mongoose.model("Organisation", organisationSchema);
//III-exporter le model
export default Organisation;