import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema
const departmentSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
    nom:{type:String, required:true},
    description:{type:String, required:false},
    organisation:{
        type: mongoose.Schema.Types.ObjectId,
                ref: "Organisation",
    }
    },
    //b-ajouter les timestamps
    {
        timestamps: true,
    }
);

//II-ajouter le plugin du soft deleting
departmentSchema.plugin(mongooseDelete, {deletedAt: true , overrideMethods: 'all'});

//II-creer le model composé du schema creer 
const Department = mongoose.model("Department", departmentSchema);
//III-exporter le model
export default Department;