import firebase from "../../firebase";

export default function FirebaseImageUpload(fileImage) {
  const cards = []
  for (let i = 0; i < fileImage.length; i++) {

    (function () {
      var file = fileImage[i]
      // Create the file metadata

      cards.push({ name: file.fileImageObject.name, primaryValue: file.primaryValue, secondaryValue: file.secondaryValue })
      var storageRef = firebase.storage().ref()
      var cardImagesRef = storageRef.child("images/" + file.fileImageObject.name)

      var blobFile = file.fileImageObject
      cardImagesRef.put(blobFile).then(snapshot => {
      })
    })()
  }

  return cards


}

export function getFirebaseImages(pictures) {
  let storage = firebase.storage()
  for (let i = 0; i < pictures.length; i++) {
    (function () {
      storage.refFromURL("gs://msci342images.appspot.com/images/" + pictures[i].name).getDownloadURL().then((url) => {
        pictures[i].url = url
      }).catch(function (error) {
      })
    })()
  }
  return pictures
}