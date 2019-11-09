$(function () {
  var $switchPrioDate = $('input[type=radio][name=switchPrioDate]'),
    $switchPrio = $('#switch-prio'),
    $switchDate = $('#switch-date'),
    $rangePrio = $('#range-prio')

  if (!!$switchDate) {
    $switchDate.hide()
  }

  $switchPrioDate.change(function () {
    switch (this.value) {
      case 'prio':
        $switchDate.hide()
        $switchPrio.show()
        break
      case 'date':
        $switchPrio.hide()
        $switchDate.show()
        break
    }
  })

  $rangePrio.on('input change', function () {
    var $labelPrio = $('#label-prio')

    switch (this.value) {
      case '0':
        $labelPrio.text('Baja')
        break
      case '1':
        $labelPrio.text('Media')
        break
      case '2':
        $labelPrio.text('Urgente')
        break
    }
  })
})

function showDetail(el, ticket) {
  var $el = $(el),
    $ticketDetailContainer = $('#ticket-detail')

  $el.siblings('.active').removeClass('active');
  $el.addClass('active');
  $ticketDetailContainer.html(ticket)
}