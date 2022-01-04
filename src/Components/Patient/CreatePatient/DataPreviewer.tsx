import React from 'react';
import PureModal from 'react-pure-modal';
import { CustomOrder, OrderKind } from '../../../Types/PatientProfile';
import Button from '../../Form/Button';

type Props = {
    show: boolean,
    data: Object[],
    onClose: ()=>void,
    onItemDeleted: (newData: Object[]) =>void
}
export default class DataPreviewer extends React.Component<Props> {

    capitalize(word: string) {
        if(!word) return word;
        const array = word.split("");
        array[0] = array[0].toUpperCase();
        return array.join("");
    }

    remove(index: number) {
        const copy = new Array(...this.props.data);
        copy.splice(index,1);
        this.props.onItemDeleted(copy);
    }

    checkForCustomMed(object: any) {
        return object.orderKind && object.orderKind === OrderKind.custom;
    }


    renderData(row:Object, index: number) {
        if(this.checkForCustomMed(row)) {
            return <td colSpan={Object.keys(this.props.data[0]).length} className="border-2 text-left pl-2" key={index}>{(row as CustomOrder).order}</td>
        } else {
            return Object.values(row).map((entry, j) => <td className="border-2" key={index + j}>

                {entry instanceof Array ? "Options Editor is under development"
                
                : this.capitalize(entry.toString())}

            </td>)
        }
    }

    public render() {
        return (
            <PureModal isOpen={this.props.show} onClose={this.props.onClose} width="80vw">
                {this.props.data.length > 0 ?
                    <table className="w-full my-8 text-center">
                        <thead>
                            <tr>
                                {Object.keys(this.props.data[0]).map((key, i) => <th className="border-2"
                                    key={i}>{this.capitalize(key)}</th>)}
                                <th className="border-2 w-52">Delete</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {this.props.data.map((row, i) =>
                                <tr key={i}>
                                    
                                    {this.renderData(row, i)}    

                                    <td className="border-2 overflow-hidden">
                                        <Button className="my-1" onClick={()=>this.remove(i)}>Remove</Button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    : <h1>No Data Available </h1>}
            </PureModal>

        );
    }
}