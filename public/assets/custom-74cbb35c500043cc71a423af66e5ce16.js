$(function(){var a;$("#camera-vendor").one("focus",function(){a=this.value}).on("change",function(){$("#camera-model"+a).addClass("hidden"),$("#camera-model"+this.value).removeClass("hidden"),a=this.value});var e=document.location.toString();e.match("#")&&($(".nav-tabs a[href=#"+e.split("#")[1]+"]").tab("show"),setTimeout(function(){scrollTo(0,0)},10)),$(".nav-tabs a").on("shown.bs.tab",function(a){window.location.hash=a.target.hash,scrollTo(0,0)}),$("#additional").click(function(){$("#settings").slideToggle("slow",function(){})})}),$(function(){$("body").popover({selector:'[data-toggle="popover"]'}),$("body").tooltip({selector:'a[rel="tooltip"], [data-toggle="tooltip"]'}),$("#test").click(function(a){var e=["external_url=http://"+$("#camera-url").val()+":"+$("#port").val(),"jpg_url="+$("#snapshot").val(),"cam_username="+$("#camera-username").val(),"cam_password="+$("#camera-password").val()];a.preventDefault();var t=Ladda.create(this);t.start();var o=0,n=setInterval(function(){o=Math.min(o+.025,1),t.setProgress(o),1===o&&(t.stop(),clearInterval(n))},200);$.getJSON("https://api.evercam.io/v1/cameras/test.json?"+e.join("&")).done(function(a){console.log("success"),$("#testimg").attr("src",a.data)}).fail(function(a){$("#test-error").text(a.responseJSON.message),console.log("error")}).always(function(){t.stop(),clearInterval(n)})}),$("#additional").click(function(){$("#settings").slideToggle("slow",function(){})});var a;$("#camera-vendor").one("focus",function(){a=this.value}).on("change",function(){$("#camera-model"+a).addClass("hidden"),$("#camera-model"+this.value).removeClass("hidden"),a=this.value})});