import { faPenToSquare, faSquareCaretDown, faSquareCaretUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion} from "framer-motion";
import { Medication, MedicationOrder, MedicationOrderSyntax } from "nurse-o-core";
import { useEffect, useState } from "react";
import { Database } from "../../Services/Database";
type Props = {
    order: MedicationOrder,
    onUp: () => void,
    onDown: () => void,
    onDelete: ()=>void,
    onEdit: ()=>void,
}

export function MedicationOrdersPreviewer(props: Props) {

    const [med, setMed] = useState<Medication>({
        id: "", locations: [], narcoticCountNeeded: false
    })

    useEffect(()=>{

        const db = Database.getInstance();
        
        db.getMedication(props.order.id).then(m=>{
            if(m) setMed(m)
        })
    },[props.order.id])

    return (
        <motion.div className="bg-gray shadow-xl w-formWidth rounded-lg overflow-y-hidden py-5 mb-8 flex justify-evenly "
             initial={{scaleY:0 }} animate={{scaleY:1 }}>
            <div>
                <div className="text-center font-bold text-blue w-72">
                    <MedicationOrderSyntax med={med} order={props.order} />
                </div>
                <div>Type: {props.order.orderType}</div>
                <div className="mt-3">Mar: {props.order.mar.length > 0 ? props.order.mar.map((time) => time.hour.toString().padStart(2,"0") + ":" + time.minutes.toString().padStart(2,"0") + " ") : "No mar data added"}</div>
                <div className="text-blue font-bold mt-2">{props.order.completed ? "Completed" : null}</div>
            </div>
            <div className="cursor-pointer grid items-center text-xl">
                <FontAwesomeIcon icon={faPenToSquare} onClick={props.onEdit} />
                <FontAwesomeIcon icon={faTrash}  onClick={props.onDelete} className="text-red"/>
            </div>
            <div className="grid text-xl items-center">
                <FontAwesomeIcon className="cursor-pointer" onClick={props.onUp} icon={faSquareCaretUp} />
                <FontAwesomeIcon className="cursor-pointer" onClick={props.onDown} icon={faSquareCaretDown} />
            </div>
        </motion.div>
    )
}