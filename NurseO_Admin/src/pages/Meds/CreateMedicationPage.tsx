import PageView from "../_PageView";
import { Steps } from "../../Components/Steps/Steps";
import { useState } from "react";
import { Stages } from "../../Components/Stages/Stages";
import { MedicationLocation, Medication } from "nurse-o-core";
import { MedBasicInfoStage } from "../../Stages/CreateMed/MedBasicInfoStage";
import { Step } from "../../Components/Steps/Step";
import { faBuilding, faFileInvoice, faPills } from "@fortawesome/free-solid-svg-icons";
import { MedLocationStage } from "../../Stages/CreateMed/MedLocationStage";
import { MedFinalizeStage } from "../../Stages/CreateMed/MedFinalizeStage";
import { Database } from "../../Services/Database";
import { useNavigate } from "react-router-dom";
import { Announcement, broadcastAnnouncement } from "../../Services/AnnouncementService";


export default function CreateMedicationPage() {

    const [currentStage, setCurrentStage] = useState(0)

    const emptyMed:Medication = {
        id: "",
        brandName: "",
        genericName: "",
        narcoticCountNeeded: false,
        locations: []
    }

    const [med, setMed] = useState<Medication>(emptyMed)
    const navigate = useNavigate()

    const moveStage = () => {
        const stage = currentStage + 1;
        setCurrentStage(stage);
    }
    const onPrevClickHandler = () => {
        const stage = currentStage - 1;
        if (stage < 0) navigate("/")
        setCurrentStage(stage);
    }

    const onMedBasicInfo = async (id: string, brandName: string, genericName: string, narcoticCountNeeded: boolean)=>{
        if(!id) {
            broadcastAnnouncement("Can't move to the next stage without entering med info first", Announcement.error)
            return
        }
        
        const db = Database.getInstance()
        med.id = id
        med.brandName = brandName
        med.genericName = genericName
        med.narcoticCountNeeded = narcoticCountNeeded

        const medReference = await db.getMedication(id)
        if(medReference) med.locations = medReference.locations
        setMed(med);
        moveStage()
    }

    const onMedLocationInfo = async (locationId: string, drawerName: string, slotName: string,dose: string, type: string, barcode: string)=>{
        const db = Database.getInstance()
        const location:MedicationLocation = {
            id: locationId,
            drawer: drawerName,
            slot: slotName,
            dose: dose,
            barcode: barcode,
            type: type
        }
        if(!med.locations) med.locations = []
        med.locations.push(location)
        setMed(med);
        await db.addMedication(med)
        moveStage();
    }



    return (
        <PageView>
            <Steps activeStep={currentStage}>
                <Step icon={faPills} />
                <Step icon={faBuilding} />
                <Step icon={faFileInvoice} />
            </Steps>

            <Stages stage={currentStage}>
                <MedBasicInfoStage onPrev={onPrevClickHandler} onNext={onMedBasicInfo} />
                <MedLocationStage onPrev={onPrevClickHandler}  onNext={onMedLocationInfo} />
                <MedFinalizeStage onPrev={onPrevClickHandler} med={med} />
            </Stages>
        </PageView>
    );
}