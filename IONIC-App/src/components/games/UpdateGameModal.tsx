import { IonButton, IonButtons, IonCheckbox, IonContent, IonHeader, IonInput, IonItem, IonModal, IonText, IonTitle, IonToast, IonToolbar } from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { DeleteGame, Games, UpdateGame } from "../../utils/Connections";
import { closeCircleOutline } from "ionicons/icons";

interface DeleteConfirmModalProps {
    game: Games | null;
    onClose: () => void;
    updateGames: () => void;
    toast: React.RefObject<HTMLIonToastElement | null>;
}

const UpdateGameModal: React.FC<DeleteConfirmModalProps> = ({ game, onClose, updateGames, toast }) => {

    const title = useRef<HTMLIonInputElement>(null);
    const plataform = useRef<HTMLIonInputElement>(null);
    const hoursPlayed = useRef<HTMLIonInputElement>(null);
    const isCompleted = useRef<HTMLIonCheckboxElement>(null);
    const genre = useRef<HTMLIonInputElement>(null);
    const img = useRef<HTMLInputElement>(null);

    const showToast = async (
        message: string,
        color: "success" | "warning" | "danger",
        duration = 2000
    ) => {
        if (!toast.current) return;
        toast.current.message = message;
        toast.current.color = color;
        toast.current.duration = duration;
        toast.current.isOpen = true;
        toast.current.onDidDismiss = async () => ({ data: undefined, role: undefined });
        await toast.current.present();
    };

    useEffect(() => {

        if (title.current) {
            title.current.value = game?.title;
            plataform.current!.value = game?.platform || '';
            hoursPlayed.current!.value = game?.hoursPlayed ? String(game.hoursPlayed) : '';
            isCompleted.current!.checked = game?.isCompleted || false;
            genre.current!.value = game?.genre || '';
        }


    }, [game]);

    async function handleUpdate() {

        try {
            if (title.current?.value && plataform.current?.value
                && hoursPlayed.current?.value
                && (img.current?.files !== null && img.current?.files !== undefined)
                && (isCompleted.current?.checked !== undefined)
                && genre.current?.value) {

                await UpdateGame({
                    id: game?.id || 0,
                    genre: String(genre.current?.value),
                    hoursPlayed: String(hoursPlayed.current?.value),
                    title: String(title.current?.value),
                    platform: String(plataform.current?.value),
                    image: img.current.files[0],
                    isCompleted: String(isCompleted.current?.checked)
                })

                await showToast("Game successfully updated!", "success");

                onClose();
                updateGames();

            } else {
                await showToast(
                    "Please complete all required fields. The image upload is optional.",
                    "warning"
                );

            }
        } catch (error: any) {
            await showToast(
                "A game with this title already exists. Please choose a different title.",
                "danger"
            );
        }
    }

    return (
        <>
            <IonModal
                className='ion-modal showContent'
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
                            labelPlacement="floating"
                            type="text"
                            placeholder="Title game?"
                            clearInput={true}
                            clearInputIcon={closeCircleOutline}
                            value={game?.title || ''}
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
                            value={game?.platform || ''}
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
                            value={game?.hoursPlayed ? String(game.hoursPlayed) : ''}
                            ref={hoursPlayed}
                        />
                    </IonItem>

                    <IonItem>
                        <IonCheckbox
                            checked={game?.isCompleted || false}
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
                            value={game?.genre || ''}
                            ref={genre}
                        />
                    </IonItem>

                    <IonItem>
                        <label htmlFor="imageInput" >Image?</label>
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

export default UpdateGameModal;