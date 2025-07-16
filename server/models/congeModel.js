import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema
const congeSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
        employee:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"},
        date_debut:{type:Date, required:true},
        date_fin:{type:Date, required:true},
        nombreDeJours:{type:Number, required:true},
        motif:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "DroitConge",
        },
        justificatif:[{type:String, required:false}],
        status : {
            type: String,
            enum: ["en attente", "approuve", "refuse"],
            default: "en attente",
        },
        commentaire:{type:String, required:false},
        approuvePar:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Employee"
        },
        refusePar:{
             type: mongoose.Schema.Types.ObjectId,
             ref: "Employee"
        },

    },
    //b-ajouter les timestamps
    {
        timestamps: true,
    }
);

//II-ajouter le plugin du soft deleting
congeSchema.plugin(mongooseDelete, {deletedAt: true  , overrideMethods: 'all'});


//II-creer le model composé du schema creer 
const Conge = mongoose.model("Conge", congeSchema);
//III-exporter le model
export default Conge;   