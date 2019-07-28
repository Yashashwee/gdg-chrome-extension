document.addEventListener(
  "DOMContentLoaded",
  function() {
    $("#sel2").hide();

    //Emptying and re-appending elements didn't work due to an error so a hard reload button
    $("#reload").click(function () {
      location.reload(true);
    });

    //Get the selected country
    $("#sel1").change(function() {
      var sel1 = document.getElementById("sel1");
      var country = sel1.options[sel1.selectedIndex].text;

      //Create an endpoint to get the name of the gdgs in that country
      url = "https://api-gdg.herokuapp.com/custom/country/" + country;

      $("#sel2").empty();
      var options = "";

      //the first option should be select
      options = "<option>Select GDG</option>";
      fetch(url)
        .then(data => {
          return data.json();
        })
        .then(res => {
          var gdgCount = 0; //To count the no of gdgs in the country
          res.forEach(element => {
            options += getTemplate(element);
            gdgCount++;
          });
          $("#gdgCount").empty();
          var gdgCountpara = 'The number gdgs in '+ country + ' is ' + gdgCount;
          $("#gdgCount").append(gdgCountpara)
          //put all the names in the list

          $("#sel2").append(options);
          $("#sel2").show();
          //get the name of the selected gdg
          $("#sel2").change(function() {
            $("div[id^='fetch-event']").empty();
            var sel2 = document.getElementById("sel2");
            var gdgName = sel2.options[sel2.selectedIndex].text;
            // Button.addEventListener("click", function() {
            //   //redirect to event-rsvp page
            //   window.location.replace("/start.html?gdg=" + gdgName);
            // });
            var abtGDG;
            res.forEach(element=> {
              if(element.urlname==gdgName)
              {
                abtGDG = element;              }
            });
            var gdgEvents = abtGDG.events;
            var ev = '';
            var i = 0;

            //For upcoming events there it just simply appends that div
            gdgEvents.upcoming.forEach(element => {
              ev += getTemplateNew(element);
            });
            $("#fetch-event-upcoming").append(ev);
            ev = '';

            //for past events
            for(var j=0, len = gdgEvents.past.length;j<len;j++){
              element = gdgEvents.past[j];
              ev = getTemplateNew(element);
              var indexId = (Math.floor(j/3)+ 1)
              
              //for a every 3 past events a new div is generated
              if(j%3==0)
              {
                var newDiv = getTemplatepast(indexId,len);
                //tried putting in number of pages but too many to fit
                // var newPage = getNewPage(indexId);
                // $("#pagination").append(newPage);
                var currentPage = `${j+1}/${Math.floor(len/3)}`;

                $("#events-container").append(newDiv);

              }
              

              //the newly generated div with id fetch-event-past-(the nth div) is appended with 3 events one by one
              var appId = "#fetch-event-past-"+ indexId;
              $(appId).append(ev);
              };
          
          });
        });
    });
    
    function getTemplate(member) {
      var tmp = "<option>" + member.urlname + "</option>";
      return tmp;
    }
    //The template for the part of the page that is hidden initially
    function getTemplatepast(i,len){
      var plusi = i + 1;
      var template = `<div data-page="${plusi}" id="fetch-event-past-${i}" style="display:none;">
      <h4>
          Past events
        </h4>
        <h6>${i}/${Math.round(len/3)}</h6>
      </div>`;
      return template;
    }
    // function getNewPage(i){
    //   var plusi = i + 1;
    //   var template =`<li data-page="${i+2}"><a href="#" >${i+1}</a></li>`;
    //   return template;
    // }

    function getTemplateNew(member) {
      //console.log(member);
      var template = `<div class="card" style="height: 200px">
      <img
        src="https://cloud.google.com/_static/images/cloud/icons/favicons/onecloud/super_cloud.png"
        alt="Avatar"
        style="max-height: 50px;"
      />
      <div class="container">
        <h4><b>${member.name}</b></h4>
        <div class="rsvp-btn">
          <p>${member.local_date}</p>
          <a href=${
            member.link
          } target="_blank">
          <button class="button" style="vertical-align:middle">
            <span>Info</span>
          </button>
          </a>
        </div>
      </div>
    </div>`;
      // console.log(template);
      return template;
    }
  },
  false
);
