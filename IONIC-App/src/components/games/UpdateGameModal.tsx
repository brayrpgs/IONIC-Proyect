import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonModal, IonText, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { DeleteGame, Games, UpdateGame } from "../../utils/Connections";
import { closeCircleOutline } from "ionicons/icons";

interface DeleteConfirmModalProps {
    game: Games | null;
    onClose: () => void;
    updateGames: () => void;
    setMessageToast: (message: string) => void;
    setShowToast: (showToast: boolean) => void;
    setColorToast: (colorToast: string) => void;
}

const UpdateGameModal: React.FC<DeleteConfirmModalProps> = ({ game, onClose, updateGames, setMessageToast, setShowToast, setColorToast }) => {

    const [title, setTitle] = useState('');
    const [platform, setPlatform] = useState('');
    const [hoursPlayed, setHoursPlayed] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [genre, setGenre] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (game) {
            setTitle(game.title || '');
            setPlatform(game.platform || '');
            setHoursPlayed(game.hoursPlayed ? String(game.hoursPlayed) : '');
            setIsCompleted(game.isCompleted || false);
            setGenre(game.genre || '');
        }
    }, [game]);

    async function handleUpdate() {

        try {
            if (title && platform && hoursPlayed && genre) {

                const result = await UpdateGame({
                    id: game?.id || 0,
                    genre,
                    hoursPlayed,
                    title,
                    platform,
                    image: imageFile,
                    isCompleted: String(isCompleted)
                });

                if (result) {
                    setMessageToast("Game successfully updated!");
                    setShowToast(true);
                    setColorToast("success")

                    onClose();
                    updateGames();
                } else {
                    setMessageToast("An error has ocurred while updating the game. Try again!");
                    setShowToast(true);
                    setColorToast("danger")
                }

            } else {
                setMessageToast("Please complete all required fields. The image upload is optional.");
                setShowToast(true);
                setColorToast("warning")

            }
        } catch (error: any) {
            setMessageToast("A game with this title already exists. Please choose a different title.");
            setShowToast(true);
            setColorToast("danger")
        }
    }

    return (
        <>
            <IonModal
                className='ion-modal showContent'
                data-testid={`update-modal`}
                isOpen={true}
                showBackdrop={false}
            >
                <IonHeader>
                    <IonToolbar>

                        <IonButtons
                            slot="start">

                            <IonButton
                                onClick={(e) => {
                                    (e.currentTarget as HTMLElement).blur()
                                    onClose();
                                }}
                            >
                                Cancel
                            </IonButton>

                        </IonButtons>

                        <IonTitle className='title-modal'>Update game</IonTitle>

                        <IonButtons
                            slot="end"
                        >

                            <IonButton
                                strong={true}
                                data-testid={`update-confirm-button`}
                                onClick={(e) => {
                                    (e.currentTarget as HTMLElement).blur()
                                    handleUpdate();
                                }}
                            >
                                Update
                            </IonButton>

                        </IonButtons>

                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-content showContent">
                    <IonItem >
                        <IonInput
                            label="Title"
                            data-testid="update-title-input"
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
                            label="Platform"
                            data-testid="update-platform-input"
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
                            label="Hours Played"
                            data-testid="update-hours-played-input"
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
                            checked={game?.isCompleted || false}
                            data-testid="update-is-completed-checkbox"
                            value={isCompleted}
                            onIonChange={(e) => setIsCompleted(e.detail.checked)}
                        >
                            is Completed?
                        </IonCheckbox>
                    </IonItem>

                    <IonItem>
                        <IonInput
                            label="Genre"
                            data-testid="update-genre-input"
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
                        <label htmlFor="imageInput" >Image?</label>
                        <input
                            id="imageInput"
                            data-testid="update-image-input"
                            type="file"
                            accept="image/*"
                            style={{ padding: '8px' }}
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                        />
                    </IonItem>
                </IonContent>
            </IonModal>

        </>
    );
}

export default UpdateGameModal;