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

  $.fn.serializeFormJSON = function () {
    var o = {},
      a = this.serializeArray()

    $.each(a, function () {
      if (o[this.name]) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]]
        }
        o[this.name].push(this.value || '')
      } else {
        o[this.name] = this.value || ''
      }
    })

    return o;
  }
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

function getSector(category) {
  switch (category) {
    case 0: case 1: case 2:
      return 'Desarrollo'
    case 3: case 4: case 5:
      return 'Comunicaciones'
    case 6: case 7:
      return 'Soporte'
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
    $description = $ticketDetail.find('#ticketDescription'),
    // Botones Modal
    $deleteButton = $('#deleteModal .idButton'),
    $cancelButton = $('#cancelModal .idButton'),
    $resolveButton = $('#resolveModal .idButton'),
    $divideButton = $('#divideModal .idButton'),
    $assignButton = $('#assignModal .idButton')

  $el.siblings('.active').removeClass('active');
  $el.addClass('active');

  $.ajax({
    type: 'GET',
    url: '/ticket/' + id,
    success: function(data) {
      var ticket = data.ticket
      
      $ticketDetail.addClass('active')
      $id.html(ticket._id)
      $status.html(getStatus(ticket.status))
      $user.html(ticket.user)
      $category.html(getCategory(ticket.category))
      $priority.html(getPriority(ticket.priority))
      $date.html(ticket.date)
      $sector.html(getSector(ticket.category))
      $title.html(ticket.title)
      $description.html(ticket.description)

      // Botones Modal
      $deleteButton.data('id', ticket._id)
      $cancelButton.data('id', ticket._id)
      $resolveButton.data('id', ticket._id)
      $divideButton.data('id', ticket._id)
      $assignButton.data('id', ticket._id)
    }
  })
}

function deleteTicket(button) {
  var id = $(button).data('id')

  $.ajax({
    type: 'PUT',
    url: '/ticket/delete/' + id,
    success: function () {
      $('#deleteModal').modal('hide')
      location.reload()
    }
  })
}

function cancelTicket(button) {
  var id = $(button).data('id')

  $.ajax({
    type: 'PUT',
    url: '/ticket/cancel/' + id,
    success: function () {
      $('#cancelModal').modal('hide')
      location.reload()
    }
  })
}

function resolveTicket(button) {
  var id = $(button).data('id')

  $.ajax({
    type: 'PUT',
    url: '/ticket/resolve/' + id,
    success: function () {
      $('#resolveModal').modal('hide')
      location.reload()
    }
  })
}

function assignTicket(button) {
  var id = $(button).data('id'),
    specialist = $('#assignModal #specialist').val()

  $.ajax({
    type: 'PUT',
    url: '/ticket/assign/' + id,
    data: {
      specialist: specialist
    },
    success: function () {
      $('#assignModal').modal('hide')
      location.reload()
    }
  })
}

function divideTicket(button) {
  var id = $(button).data('id'),
    data = $('#formDivide').serializeFormJSON()

  $.ajax({
    type: 'POST',
    url: '/ticket/divide/' + id,
    data: data,
    success: function () {
      $('#divideModal').modal('hide')
      location.reload()
    }
  })
}