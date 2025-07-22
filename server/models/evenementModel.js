import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema
const evenementSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
        titre:{type:String, required:true},
        description:{type:String, required:false},
        date_debut:{type:Date,required : true},
        date_fin:{type:Date, required : true},
        lieu:{type:String, required:false},
        organisation:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organisation",
        },
    },
    //b-ajouter les timestamps
    {
        timestamps: true,
    }
);

//II-ajouter le plugin du soft deleting
evenementSchema.plugin(mongooseDelete, {deletedAt: true , overrideMethods: 'all'});


//II-creer le model composé du schema creer 
const Evenement = mongoose.model("Evenement", evenementSchema);
//III-exporter le model
export default Evenement;

