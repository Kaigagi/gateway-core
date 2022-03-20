const {getFirestore} = require('firebase-admin/firestore')
const db = getFirestore()



async function pagination(field, pageSize, page, collection){
    // check pageSize
    if (page < 0 || page > 20){
        throw new Error("",{cause:""})
    }
    // check page

    const ref = db.collection(collection)
    // check collection is vaild or not 
    if(ref){

    }
    const query = ref.orderBy(field).limit(page).get()
    return query
}


function nextPage(last){


}


function prevPage(first){



}

exports.module = {
}
