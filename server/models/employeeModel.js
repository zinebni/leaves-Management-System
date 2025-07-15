import mongoose from "mongoose";
import mongooseDelete from 'mongoose-delete'; //pour instaler :npm install mongoose-delete


//I-initialiser le schema
const employeeSchema = new mongoose.Schema(
    //a-ajouter les champs
    {
    nom:{type:String, required:true},
    prenom:{type:String, required:true},
    email:{
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
               
                return /^[^\s@]+@[^\s@]+\.aufes\.org$/.test(value);
            },
            message: 'Format d\'adresse e-mail invalide, veuillez saisir une adresse e-mail valide.',
        }
    },
    password:{type:String, required:true},
    verifyOtp:{type:String, default:''},
    verifyOtpExpireAt:{type:Number, default:0},
    isAccountVerified:{type:Boolean, default:false},
    resetOtp:{type:String, default:''},
    resetOtpExpiredAt:{type:Number, default:0},
    role:{
        type:String,
        enum:["RH","employe"]
    },
    verificationEmail:{type:String, required:true},
    numeroDeContact:{
        type: String,
        trim: true,
        validate: {
            validator: function (value) {
            return /^(\+212|0)([5-7])[0-9]{8}$/.test(value);
            },
            message: 'Numéro de téléphone invalide. Exemple : +212612345678 ou 0612345678',
        }
    },
    dateDeRecrutement:{type:Date, default:Date.now},
    dateDeDepart:{type:Date,default: null},
    department:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department"}],
    organisation:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organisation",
    },
    sexe: {
        type: String,
        enum: ['Homme', 'Femme'],
        required: true
    },
    situationFamiliale: {
    type: String,
    enum: ['célibataire', 'marié(e)', 'divorcé(e)'],
    default: 'célibataire'
    },
    nombreEnfants: {
        type: Number,
        default: 0
    }
    },

    //b-ajouter les timestamps
    {
        timestamps: true,
    }
);

//II-ajouter le plugin du soft deleting
employeeSchema.plugin(mongooseDelete, {deletedAt: true , overrideMethods: 'all'});


//II-creer le model composé du schema creer 
const Employee = mongoose.model("Employee", employeeSchema);
//III-exporter le model
export default Employee;