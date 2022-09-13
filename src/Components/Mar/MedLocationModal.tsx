import { useEffect, useState } from 'react';
import PureModal from "react-pure-modal"
import { Medication, MedicationLocation } from "nurse-o-core"
import { VerifyPopup } from './VerifyPopup';
import { $locationID, $showVerify } from '../../Services/State';
import { filter } from 'lodash';

type Props = {
    med: Medication,
    onClose: () => void
}

export function MedLocationModal(props: Props) {


    const [locationToBeVerified, setLocationToBeVerified] = useState<MedicationLocation | null>(null)
    const [locations, setLocations] = useState<MedicationLocation[]>([])




    const onMedVerified = () => {
        setLocationToBeVerified(null)
        props.onClose();
    }

    
    useEffect(()=>{
        const onLocationIDUpdated = (location:string | null) => {
            if(location === null) {
                setLocations(props.med.locations)
            } else {
                const filteredLocations = filter(props.med.locations, {id: location})
                setLocations(filteredLocations)
                console.log(filteredLocations)
            }
        }

        const sub = $locationID.subscribe(onLocationIDUpdated)
        return sub.unsubscribe()
        
    }, [props.med.locations])

    return (
        <PureModal width='60vw' header="Order" isOpen={true} onClose={props.onClose} className="min-h-[29vh]">
            <div>

                {locations.length > 0 ?
                    <table className='w-full m-auto'>
                        <thead>
                            <tr className='text-left h-10'>
                                <th className='pl-5'>Medication</th>
                                <th className='pl-5'>Type</th>
                                <th className='pl-5'>Dose</th>
                                <th>Drawer</th>
                                <th>Slot</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((location, i) =>
                                <tr key={i} className='h-16 odd:bg-gray-100 even:bg-gray-300 '>
                                    <td className='pl-5'>{props.med.name}</td>
                                    <td className='pl-5'>{location.type.toLocaleUpperCase()}</td>
                                    <td>{location.dose}</td>
                                    <td>{location.drawer}</td>
                                    <td>{location.slot}</td>
                                    {$showVerify.value ? 
                                        <td className='w-36'><button className='bg-red-700 text-white px-10 h-10 rounded-full' onClick={() => setLocationToBeVerified(location)}>Verify</button></td>
                                    : null}
                                </tr>
                            )}
                        </tbody>
                    </table> :
                    <h1 className='text-center font-bold py-6'>Medication is not available, please call pharmacy</h1>
                }

                {locationToBeVerified ?
                    <VerifyPopup 
                        med={props.med}
                        location= {locationToBeVerified}
                        onVerified={onMedVerified}
                        onClose={props.onClose} />
                    : null}

            </div>
        </PureModal>
    );
}
