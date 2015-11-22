$(document).ready(function() {
    $("#userForm").submit(function(e){
    	e.preventDefault();
    	username = $("#firstName").val() + $("#lastName").val();
    	email = $("#email").val();
    	gender = $("input[name=gender]:checked").val();
    	
        $.ajax({
    	url: "/user/" + username + "/" + gender + "/" + email,
    	type: 'PUT',
    	success: function(result) {
        	$(".message").show();
            $("#input").html(result.username + " was added to facebook! Say goodbye your personal information.");  
            //console.log(result);
    	}
	});
    }); 


    $("#editForm").submit(function(e){
    	e.preventDefault();
    	username = $("#editFirstName").val() + $("#editLastName").val();
    	email = $("#editEmail").val();
    	gender = $("input[name=editGender]:checked").val();
    	
        $.ajax({
    	url: "/user/" + username + "/" + gender + "/" + email,
    	type: 'POST',
    	success: function(result) {
        	$(".message").show();
            $("#input").html(result.username + " is an updated slave to facebook! They are now " + result.gender + " and their email is now " + result.email);  
            $(".edit").hide();
    	}
	});
    }); 

    $(".update").click(function(){
        $(".edit").slideToggle();

    $("#deleteUser").click(function(){
    	console.log("delete");
    	$.ajax({
    	url: "/user/" + username,
    	type: 'DELETE',
    	success: function(result) {
    		$(".edit").hide();
    		$(".message").show();
    		$(".update").hide();
            if (result == ""){
                $("#input").html("That isn't a real user!");
            }
            else{
                $("#input").html("user " + result.username + " is finally free");
            }
    	}
	});

    });


    });

      $("#searchForm").submit(function(e){
    	e.preventDefault();
    	username = $("#search").val();
        $.ajax({
    	url: "/user/" + username,
    	type: 'GET',
    	success: function(result) {
            if (username == "") result = "";
    		$(".message").show();
    		if(result == ""){
    		  $("#input").html("That person isn't a facebook user, lucky them.");
    	    }
            else{
              $("#editFirstName").val(result.username);
    	      $("#editEmail").val(result.email);
    	      $("input[name=editGender]:checked").val(result.gender);
              $(".update").show();
              $("#input").html(result.username + " is a slave to facebook! They are " + result.gender + " and their email is " + result.email);
            }
    	}
	});
    });

       $("#listAll").click(function(e){
        e.preventDefault();
        window.location.href='/users';
    });


    
});

