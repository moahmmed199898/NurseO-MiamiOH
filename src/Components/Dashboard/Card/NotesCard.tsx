import React from 'react';
import {Note} from '../../../Types/PatientProfile';
import Card from './Card';
import NoteEntry from './NoteEntry';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    notes: Note[] | undefined
}

export default class NotesCard extends React.Component<Props> {

    public render() {
        return (
            <Card className={this.props.className} title="Nurse Notes">
                <thead className="font-bold">
                    <tr>
                        <td className="border-2 p-2">Date</td>
                        <td className="border-2 p-2">Title</td>
                    </tr>
                </thead>
                <tbody>
                    {this.props.notes ? 
                        this.props.notes.map((note,i) => <NoteEntry key={i} note={note}></NoteEntry>): 
                        <tr><td><h1>No notes added</h1></td></tr>
                    }
                </tbody>
        </Card>

        );
    }
}