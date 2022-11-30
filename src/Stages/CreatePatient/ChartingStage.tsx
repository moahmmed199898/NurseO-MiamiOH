import { faBedPulse, faBong, faComputer, faDroplet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { filter } from "lodash";
import { PatientChart, ReportSet, ReportType, StudentReport } from "nurse-o-core";
import { useEffect, useState } from "react";
import ReportsSubmitter from "../../Components/Reports/ReportsSubmitter";
import { ArrayPreviewer } from "../../Components/Stages/ArrayPreviewer";
import { BaseStageProps, BaseStage } from "../../Components/Stages/BaseStage"
import { Td } from "../../Components/Table/Td";
import { Tr } from "../../Components/Table/Tr";
import { Database } from "../../Services/Database";

export type Props = BaseStageProps & {
    onNext: (studentReports: StudentReport[]) => void,
    patient?:PatientChart
}

export function ChartingStage(props: Props) {

    const [allReports, setAllReports] = useState([] as ReportSet[])
    const [reportSets, setReportSets] = useState([] as ReportSet[])
    const [studentReports, setStudentReports] = useState(props.patient?.studentReports || [] as StudentReport[])
    const [activeReportSet, setActiveReportSet] = useState(0)
    const [reportType, setReportType] = useState<ReportType>("studentVitalsReport")
    const [hoveringOnArrayPreviewer, setHoveringOnArrayPreviewer] = useState(false)

    console.log(studentReports)


    useEffect(() => {
        const db = Database.getInstance();
        db.getSettings().then(v => {
            setAllReports(v.reportSet)
            const firstReport = filter(allReports, {type:reportType});
            setReportSets(firstReport);
        })
    }, [allReports, reportType])


    const onNextClickHandler = () => {
        props.onNext(studentReports)
    }

    const onReportSetChangeHandler= (reportSetIndex:number)=>{
        setActiveReportSet(reportSetIndex);
        let tempReportType:ReportType = "studentVitalsReport"
        switch(reportSetIndex) {
            case 0:  tempReportType = "studentVitalsReport"; break;
            case 1:  tempReportType = "studentAssessmentReport"; break;
            case 2:  tempReportType = "studentIOReport"; break;
            default: tempReportType = "studentVitalsReport"; break;
        }

        const reports = filter(allReports, {type:tempReportType});
        setReportType(tempReportType)
        setReportSets([...reports]);
    }

    const onDeleteClickHandler = (index:number)=>{
        studentReports.splice(index, 1)
        setStudentReports([...studentReports])
    }

    return (
        <div className="overflow-hidden relative">
            <BaseStage {...props} onNext={onNextClickHandler} title="Charting" icon={faComputer} moveLeft={studentReports.length > 0} customIconNTitle>
                <div className="flex justify-around text-darkGray">
                    <div className={"cursor-pointer " + (activeReportSet === 0 ? "text-blue" : null)} onClick={()=>onReportSetChangeHandler(0)}>
                        <FontAwesomeIcon icon={faBedPulse} className="text-3xl text-center" />
                        <h1 className="font-bold mt-4">Vitals</h1>
                    </div>
                    <div className={"cursor-pointer " + (activeReportSet === 1 ? "text-blue" : null)} onClick={()=>onReportSetChangeHandler(1)}>
                        <FontAwesomeIcon icon={faBong} className="text-3xl text-center" />
                        <h1 className="font-bold mt-4">Assessment</h1>
                    </div>
                    <div className={"cursor-pointer " + (activeReportSet === 2 ? "text-blue" : null)} onClick={()=>onReportSetChangeHandler(2)}>
                        <FontAwesomeIcon icon={faDroplet} className="text-3xl text-center" />
                        <h1 className="font-bold mt-4">I/O Record</h1>
                    </div>
                </div>
                <ReportsSubmitter reportType={reportType} reportSets={reportSets} 
                studentReports={studentReports} onSave={setStudentReports} />
            </BaseStage>

            <ArrayPreviewer headerItems={["Date", "Time", "Set Name", "Field", "Value"]} show={studentReports.length > 0} title="Added History"
             className="hover:w-[50rem] transition-all h-full overflow-clip"
             onHoverStart={()=>setHoveringOnArrayPreviewer(true)}
             onHoverEnd={()=>setHoveringOnArrayPreviewer(false)}
             >
                {studentReports.map((r,i)=>
                    <Tr key={i}>
                        <Td>{r.date}</Td>
                        <Td>{r.time}</Td>
                        <Td>{r.setName}</Td>
                        <Td>{r.vitalName}</Td>
                        <Td>{r.value}</Td>
                        {hoveringOnArrayPreviewer ? 
                            <Td className="w-40">
                                <button className="bg-red w-full h-10 text-white font-bold"
                                onClick={()=>onDeleteClickHandler(i)}>Delete</button>
                            </Td>
                        : <></> }
                    </Tr>
                )}
            </ArrayPreviewer>

        </div>
    )

}