// Get the modal
var modal = document.getElementById("myModal");
  
// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}



const submit=document.getElementById("submitbutton");
submit.addEventListener("click",()=>{
  submitForm();
});

function submitForm(){
    var name=document.getElementById("name");
    let pathname=window.location.pathname.split('/');
    let documentId=pathname[pathname.length-2];
    const useremail=window.location.pathname.split('/')[2];
    var date=document.getElementById('date');
    let temp=date.value.split('-').reverse();
    temp[1]=parseInt(temp[1]).toString();
    temp=temp.join('/');
    let data={
      'data':JSON.stringify({
        'type':name.value,
        'date':temp,
        'approved':"true"
      }),
      'patientId':documentId
    }
    try {
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "/patient/allergy/create", true);
      xhttp.setRequestHeader('Content-type', 'application/json');
      xhttp.setRequestHeader('useremail',useremail);
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('result').innerHTML="Data Added";
            setTimeout(() => {
                document.getElementById('result').innerHTML=""
            }, 3000);
      }
      if(this.status==400){
        document.getElementById('result').innerHTML="Error";
        document.getElementById('result').style="background-color=red"
      }
    };
    xhttp.send(JSON.stringify(data));
  } catch (error) {
  }
   
 }