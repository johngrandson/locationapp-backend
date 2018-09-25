function getBus() {
    alert('ola')
    axios.get('localhost:3000/api')
        .then((response) => {
            alert(response)
        })
        .catch((error) => {
            console.log(error);;
        });
}