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

function getPriority(priority) {
  switch (priority) {
    case 0:
      return 'Baja'
    case 1:
      return 'Media'
    case 2:
      return 'Urgente'
  }
}

function getCategory(category) {
  switch (category) {
    case 0:
      return 'Pedido de desarrollo'
    case 1:
      return 'Pedido de modificación'
    case 2:
      return 'Corrección de error'
    case 3:
      return 'Problema con internet'
    case 4:
      return 'Problema de red interna'
    case 5:
      return 'Problema de servicio'
    case 6:
      return 'Ayuda para operar sistema'
    case 7:
      return 'Ayuda para operar un hardware'
  }
}

function getStatus(status) {
  switch (status) {
    case 0:
      return 'Sin asignar'
    case 1:
      return 'Por realizar'
    case 2:
      return 'En proceso'
    case 3:
      return 'Finalizado'
    case 4:
      return 'Cancelado'
    case 5:
      return 'En espera'
  }
}

function showDetail(el) {
  var $el = $(el),
    id = $el.attr('data-id'),
    $ticketDetail = $('#ticket-detail'),
    $id = $ticketDetail.find('#ticketId'),
    $status = $ticketDetail.find('#ticketStatus'),
    $user = $ticketDetail.find('#ticketUser'),
    $category = $ticketDetail.find('#ticketCategory'),
    $priority = $ticketDetail.find('#ticketPriority'),
    $date = $ticketDetail.find('#ticketDate'),
    $sector = $ticketDetail.find('#ticketSector'),
    $title = $ticketDetail.find('#ticketTitle'),
    $description = $ticketDetail.find('#ticketDescription')

  $el.siblings('.active').removeClass('active');
  $el.addClass('active');

  $.ajax({
    type: 'GET',
    url: '/ticket/' + id,
    success: function(data) {
      var ticket = data.ticket

      console.log(data)

      $ticketDetail.addClass('active')
      $id.html(ticket._id)
      $status.html(getStatus(ticket.status))
      $user.html(ticket.user)
      $category.html(getCategory(ticket.category))
      $priority.html(getPriority(ticket.priority))
      $date.html(ticket.date)
      //$sector
      $title.html(ticket.title)
      $description.html(ticket.description)
    }
  })
}