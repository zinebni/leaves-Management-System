import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema
const notificationSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
        recipient:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee"},
        conge:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conge"
        },
        message:{type:String, required:true},
        isRead:{type:Boolean, default:false},
    },
    //b-ajouter les timestamps
    {
        timestamps: true,
    }
);

//II-ajouter le plugin du soft deleting
notificationSchema.plugin(mongooseDelete, {deletedAt: true , overrideMethods: 'all'});


//II-creer le model composé du schema creer 
const Notification = mongoose.model("Notification", notificationSchema);
//III-exporter le model
export default Notification;