import React from 'react';
import { AlertButton, IonAlert, IonButton, IonIcon } from '@ionic/react';
import { addCircleOutline } from 'ionicons/icons';

function CreateGame() {
    const buttonCancel: AlertButton = {
        text: "hola",
        role: "cancel",
        handler() {
            console.log("cancel")
        },

    }
    return (
        <>
            <IonButton
                id='present-alert'
                shape='round'
                fill='outline'
                size='large'
                onClick={(e) => {
                    (e.currentTarget as HTMLElement).blur();
                }}>
                create
                <IonIcon slot="end" icon={addCircleOutline}></IonIcon>
            </IonButton>
            <IonAlert
                trigger="present-alert"
                header="Create a new game?"
                buttons={[buttonCancel]}
            ></IonAlert>
        </>
    );
}
export default CreateGame;