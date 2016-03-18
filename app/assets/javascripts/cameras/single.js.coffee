#= require evercam.js.coffee
#= require cameras/single/info.js.coffee
#= require cameras/single/live.js.coffee
#= require cameras/single/sharing.js.coffee
#= require cameras/single/snapshots_navigator.js.coffee
#= require cameras/single/motion_detection.js.coffee
#= require cameras/single/api_explorer.js.coffee
#= require cameras/single/logs.js.coffee
#= require cameras/single/local_storage.js.coffee
#= require cameras/single/settings.js.coffee
#= require cameras/single/testsnapshot.js.coffee
#= require cameras/single/archives.js.coffee
#= require saveimage.js
#= require jquery.thumbhover.js

window.sendAJAXRequest = (settings) ->
  token = $('meta[name="csrf-token"]')
  if token.size() > 0
    headers =
      "X-CSRF-Token": token.attr("content")
    settings.headers = headers
  xhrRequestChangeMonth = $.ajax(settings)

initializeiCheck = ->
  $("input[type=radio]").iCheck
    radioClass: "iradio_flat-blue"

initializeDropdowns = ->
  $('[data-toggle="tooltip"]').tooltip()
  $(".dropdown-toggle").dropdown()

switchToTab = ->
  $(".nav-tab-#{Evercam.request.tabpath}").tab('show')

handleTabClick = ->
  $('.nav-tabs a').on 'click', ->
    clicked_path = $(this).attr('data-target').replace('#', '')
    if window.history and window.history.pushState
      window.history.pushState( {} , "#{clicked_path}", "#{window.Evercam.request.rootpath}/#{clicked_path}" );
  $(".nav-tabs").tabdrop "layout"

handleBackForwardButton = ->
  window.addEventListener 'popstate', (e) ->
    tab = document.location.pathname
      .replace(window.Evercam.request.rootpath, '')
      .split('/')[1]
    $(".nav-tab-#{tab}").tab('show')

handleCameraModalSubmit = ->
  $('#settings-modal').on 'click', '#add-button', ->
    $('#settings-modal').modal('hide')

handleAddToMyCameras = ->
  $('#add-to-cameras').on 'click', ->
    data =
      camera_id: Evercam.Camera.id
      email: Evercam.User.username
      permissions: "minimal"

    onError = (jqXHR, status, error) ->
      Notification.show("Failed to add camera.")

    onSuccess = (data, status, jqXHR) ->
      if data.success
        Notification.show("Camera successfully added.")
        window.location = "/v1/cameras/#{Evercam.Camera.id}"
      else
        message = "Adding a camera share failed."
        switch data.code
          when "camera_not_found_error"
            message = "Unable to locate details for the camera in the system. Please refresh your view and try again."
          when "duplicate_share_error"
            message = "The camera has already been shared with the specified user."
          when "duplicate_share_request_error"
            message = "A share request for that email address already exists for this camera."
          when "share_grantor_not_found_error"
            message = "Unable to locate details for the user granting the share in the system."
          when "invalid_parameters"
            message = "Invalid rights specified for share creation request."
          else
            message = data.message
        Notification.show(message)

    settings =
      cache: false
      data: data
      dataType: 'json'
      error: onError
      success: onSuccess
      type: 'POST'
      url: '/share'
    sendAJAXRequest(settings)

initializeTabs = ->
  window.initializeInfoTab()
  window.initializeLiveTab()
  window.initializeRecordingsTab()
  window.initializeLogsTab()
  window.initializeSharingTab()
  window.initializeExplorerTab()
  window.initializeLocalStorageTab()
  window.initializeSettingsTab()
  window.initializeArchivesTab()
  window.initializeMotionDetectionTab()

window.initializeCameraSingle = ->
  initializeTabs()
  handleTabClick()
  switchToTab()
  handleBackForwardButton()
  handleAddToMyCameras()
  initializeiCheck()
  initializeDropdowns()
  Metronic.init()
  Layout.init()
  QuickSidebar.init()
  SaveImage.init()
