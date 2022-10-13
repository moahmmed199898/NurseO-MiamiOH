import { faSquareCaretDown, faSquareCaretUp, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion} from "framer-motion";
import { MedicationOrder, MedicationOrderSyntax } from "nurse-o-core";
import { useEffect, useState } from "react";
import { Database } from "../../Services/Database";
type Props = {
    order: MedicationOrder,
    onUp: () => void,
    onDown: () => void,
    onDelete: ()=>void,
}

export function MedicationOrdersPreviewer(props: Props) {

    const [medName, setMedName] = useState("Loading...")

    useEffect(()=>{
        const db = Database.getInstance();
        db.getMedication(props.order.id).then(m=>{
            if(m) setMedName(m.brandName || m.genericName || "")
            else setMedName("Error")
        })
    },[props.order.id])

    return (
        <motion.div className="bg-gray shadow-xl w-formWidth rounded-lg overflow-y-hidden py-5 mb-8 flex justify-evenly "
             initial={{scaleY:0 }} animate={{scaleY:1 }}>
            <div>
                <div className="text-center font-bold text-blue w-72"><MedicationOrderSyntax medName={medName} order={props.order} /></div>
                <div>Type: {props.order.orderType}</div>
                <div className="mt-3">Mar: {props.order.mar.length > 0 ? props.order.mar.map((time) => time.hour.toString().padStart(2,"0") + ":" + time.minutes.toString().padStart(2,"0")) : "No mar data added"}
                </div>
            </div>
            <div className="text-red cursor-pointer grid items-center text-xl" onClick={props.onDelete}><FontAwesomeIcon icon={faTrash} /></div>
            <div className="grid text-xl items-center">
                <FontAwesomeIcon className="cursor-pointer" onClick={props.onUp} icon={faSquareCaretUp} />
                <FontAwesomeIcon className="cursor-pointer" onClick={props.onDown} icon={faSquareCaretDown} />
            </div>
        </motion.div>
    )
}