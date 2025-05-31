import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonModal, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import { addCircleOutline, closeCircleOutline } from 'ionicons/icons';
import "./CreateGame.css"
import { Games, SendGame } from '../../utils/Connections';


function CreateGame({ setData, data }: { setData: Dispatch<SetStateAction<Games[]>>, data: Games[] }) {
    const modal = useRef<HTMLIonModalElement>(null);
    const img = useRef<HTMLInputElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastColor, setToastColor] = useState("");
    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('');
    const [hoursPlayed, setHoursPlayed] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [genre, setGenre] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    function showCustomToast(message: string, color: string) {
        setToastMessage(message);
        setToastColor(color);
        setShowToast(true);
    }

    const handlerSend = async () => {
        try {
            if (title && platform && hoursPlayed && imageFile && genre) {
                try {
                    const result = await SendGame({
                        id: 0,
                        genre,
                        hoursPlayed,
                        title,
                        platform,
                        image: imageFile,
                        isCompleted: String(isCompleted),
                    });

                    if (result) {
                        setData([...data, result]);
                        setShowToast(true);
                        setIsOpen(false);
                        setTitle('');
                        setPlatform('');
                        setHoursPlayed('');
                        setIsCompleted(false);
                        setGenre('');
                        setImageFile(null);
                        if (img.current) img.current.value = '';
                        showCustomToast("Game successfully created!", "success");
                        setIsOpen(false)
                        modal.current?.dismiss()
                    }
                } catch (error) {
                    console.error('HandlerSend: SendGame failed:', error);
                }

            } else {
                showCustomToast("Please complete all required fields. The image upload is required!", "warning");

            }
        } catch (error: any) {
            showCustomToast("A game with this title already exists. Please choose a different title.", "danger");
        }
    }

    return (
        <>
            <IonButton
                id="open-modal"
                data-testid={`create-option-button`}
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
                data-testid={`create-modal`}
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
                                onClick={(e) => {
                                    (e.currentTarget as HTMLElement).blur()
                                    setIsOpen(false)
                                    modal.current?.dismiss()
                                }}
                            >
                                Cancel
                            </IonButton>

                        </IonButtons>

                        <IonTitle className='title-modal'>Create a new game</IonTitle>

                        <IonButtons
                            slot="end"
                        >

                            <IonButton
                                strong={true}
                                data-testid={`create-confirm-button`}
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
                            data-testid="create-title-input"
                            label="Title"
                            labelPlacement="floating"
                            type="text"
                            placeholder="Title game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            value={title}
                            onIonChange={(e) => setTitle(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            data-testid="create-platform-input"
                            label="Platform"
                            labelPlacement="floating"
                            type="text"
                            placeholder="Platform game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            value={platform}
                            onIonChange={(e) => setPlatform(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonInput
                            data-testid="create-hours-played-input"
                            label="Hours Played"
                            labelPlacement="floating"
                            type="number"
                            placeholder="Hours Played?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            value={hoursPlayed}
                            onIonChange={(e) => setHoursPlayed(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <IonCheckbox
                            data-testid="create-is-completed-checkbox"
                            checked={false}
                            value={isCompleted}
                            onIonChange={(e) => setIsCompleted(e.detail.checked)}
                        >
                            is Completed?
                        </IonCheckbox>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            data-testid="create-genre-input"
                            label="Genre"
                            labelPlacement="floating"
                            type="text"
                            placeholder="Genre game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            value={genre}
                            onIonChange={(e) => setGenre(e.detail.value!)}
                        />
                    </IonItem>

                    <IonItem>
                        <label htmlFor="imageInput" >Image</label>
                        <input
                            id="imageInput"
                            data-testid="create-image-input"
                            type="file"
                            accept="image/*"
                            style={{ padding: '8px' }}
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            ref={img}
                        />
                    </IonItem>
                </IonContent>
            </IonModal>
            <IonToast
                data-testid="toast-game-created"
                isOpen={showToast}
                onDidDismiss={() => setShowToast(false)}
                message={toastMessage}
                duration={2000}
                color={toastColor}
                position="bottom"
            />
        </>
    );
}
export default CreateGame;