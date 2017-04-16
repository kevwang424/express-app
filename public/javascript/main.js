$(document).ready(function(){
  $('.deleteUser').on('click', deleteUser)
  $('.updateUser').on('click', updateUser)
})

function deleteUser(){
  var confirmation = confirm('Are you sure?')

  if (confirmation){
    $.ajax({
      method: 'DELETE',
      url: '/users/delete/' + $(this).data('id')
    }).done()
    window.location.replace('/')
  } else {
    return false
  }
}
