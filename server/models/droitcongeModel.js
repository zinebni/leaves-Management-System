import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema   
const droitCongeSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
        employee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"},
            
        type:{
            type:String,
            enum:['annuel', 'maternite', 'paternite', 'maladie', 'sans_solde'],
            required:true,
        },

        joursAutorisee:{type:Number, required:true},

        joursPris:{type:Number, default:0},

        estPaye:{type:Boolean, default:false},    
    
    },
    //b-ajouter les timestamps
    {
        timestamps: true,
    }
);

//II-ajouter le plugin du soft deleting
droitCongeSchema.plugin(mongooseDelete, {deletedAt: true , overrideMethods: 'all'});


//II-creer le model composé du schema creer 
const DroitConge = mongoose.model("DroitConge", droitCongeSchema);
//III-exporter le model
export default DroitConge;