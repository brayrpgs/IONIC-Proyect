import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import { addCircleOutline, closeCircleOutline } from 'ionicons/icons';
import "./CreateGame.css"
import { Games, SendGame } from '../utils/Connections';


function CreateGame({ setData, data }: { setData: Dispatch<SetStateAction<Games[]>>, data: Games[] }) {
    const modal = useRef<HTMLIonModalElement>(null);
    const title = useRef<HTMLIonInputElement>(null);
    const plataform = useRef<HTMLIonInputElement>(null);
    const hoursPlayed = useRef<HTMLIonInputElement>(null);
    const isCompleted = useRef<HTMLIonCheckboxElement>(null);
    const genre = useRef<HTMLIonInputElement>(null);
    const img = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    const handlerSend = async () => {
        if (title.current?.value && plataform.current?.value
            && hoursPlayed.current?.value
            && (img.current?.files !== null && img.current?.files !== undefined)
            && (isCompleted.current?.checked !== undefined)
            && genre.current?.value) {
            const result = await SendGame({
                genre: String(genre.current?.value),
                hoursPlayed: String(hoursPlayed.current?.value),
                title: String(title.current?.value),
                platform: String(plataform.current?.value),
                image: img.current.files[0],
                isCompleted: String(isCompleted.current?.checked)
            })
            if (result) {
                setData([...data, result])
                setIsOpen(false)
                modal.current?.dismiss()
            }

        } else {
            console.log("error");

        }
    }

    return (
        <>
            <IonButton
                id="open-modal"
                expand="block"
                size='large'
                fill='outline'
                shape='round'
                onClick={(e) => {
                    (e.currentTarget as HTMLElement).blur();
                }}
                className='ion-button create'
            >
                Create
                <IonIcon slot="end" icon={addCircleOutline}></IonIcon>
            </IonButton>


            <IonModal
                className='ion-modal showContent'
                trigger="open-modal"
                onWillDismiss={() => { setIsOpen(false) }}
                isOpen={isOpen}
                ref={modal}
                showBackdrop={false}
            >
                <IonHeader>
                    <IonToolbar>

                        <IonButtons
                            slot="start">

                            <IonButton
                                onClick={() => {
                                    setIsOpen(false)
                                    modal.current?.dismiss()
                                }}
                            >
                                Cancel
                            </IonButton>

                        </IonButtons>

                        <IonTitle className='title-modal'>Create a new game!</IonTitle>

                        <IonButtons
                            slot="end"
                        >

                            <IonButton
                                strong={true}
                                onClick={handlerSend}
                            >
                                Confirm
                            </IonButton>

                        </IonButtons>

                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-content showContent">
                    <IonItem >
                        <IonInput
                            label="Title"
                            labelPlacement="floating"
                            type="text"
                            placeholder="Title game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={title}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Platform"
                            labelPlacement="floating"
                            type="text"
                            placeholder="Platform game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={plataform}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Hours Played"
                            labelPlacement="floating"
                            type="number"
                            placeholder="Hours Played?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={hoursPlayed}
                        />
                    </IonItem>

                    <IonItem>
                        <IonCheckbox
                            checked={false}
                            ref={isCompleted}
                        >
                            is Completed?
                        </IonCheckbox>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Genre"
                            labelPlacement="floating"
                            type="text"
                            placeholder="Genre game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            ref={genre}
                        />
                    </IonItem>

                    <IonItem>
                        <label htmlFor="imageInput" >Image</label>
                        <input
                            id="imageInput"
                            type="file"
                            accept="image/*"
                            style={{ padding: '8px' }}
                            onChange={() => { }}
                            ref={img}
                        />
                    </IonItem>
                </IonContent>
            </IonModal>
        </>
    );
}
export default CreateGame;