$(function () {
  var $switchPrioDate = $('input[type=radio][name=switchPrioDate]'),
    $switchPrio = $('#switch-prio'),
    $switchDate = $('#switch-date'),
    $rangePrio = $('#range-prio'),
    $sectorSelector = $('.sectorSelector')

  if (!!$switchDate) {
    $switchDate.hide()
  }

  $sectorSelector.change(function () {
    var $button = $(this).siblings('button')

    if (this.value != $(this).data('value')) {
      $button.prop('disabled', false);
    } else {
      $button.prop('disabled', true);
    }
  })

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
      return {
        text: 'Sin Asignar',
        class: 'sin-asignar'
      }
    case 1:
      return {
        text: 'Por Realizar',
        class: 'por-realizar'
      }
    case 2:
      return {
        text: 'En Proceso',
        class: 'en-proceso'
      }
    case 3:
      return {
        text: 'Finalizado',
        class: 'finalizado'
      }
    case 4:
      return {
        text: 'Cancelado',
        class: 'cancelado'
      }
    case 5:
      return {
        text: 'En Espera',
        class: 'en-espera'
      }
  }
}

function showDetail(el) {
  var $el = $(el),
    id = $el.attr('data-id'),
    $ticketDetail = $('#ticket-detail'),
    $id = $ticketDetail.find('#ticketId'),
    $status = $ticketDetail.find('#ticketStatus'),
    $user = $ticketDetail.find('#ticketUser'),
    $specialist = $ticketDetail.find('#ticketAssignedSpecialist'),
    $category = $ticketDetail.find('#ticketCategory'),
    $priority = $ticketDetail.find('#ticketPriority'),
    $date = $ticketDetail.find('#ticketDate'),
    $sector = $ticketDetail.find('#ticketSector'),
    $title = $ticketDetail.find('#ticketTitle'),
    $description = $ticketDetail.find('#ticketDescription'),
    $divideTicketButton = $('#divideTicketButton'),
    // Botones Modal
    $actions = $('.detail__actions'),
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
      // header
      $id.html(ticket._id)
      $status.html(getStatus(ticket.status).text)
      $status.attr('class', getStatus(ticket.status).class + ' status');
      // details
      $category.children('span').html(getCategory(ticket.category))
      if (typeof ticket.priority !== 'undefined') {
        $date.hide();
        $priority.children('span').html(getPriority(ticket.priority))
        $priority.show();
      }
      if (!!ticket.deadlineDate) {
        var formattedDate = new Date(ticket.deadlineDate).toISOString().slice(0, 10);
        
        $priority.hide();
        $date.children('span').html(formattedDate)
        $date.show();
      }
      if (!!ticket.assignedSpecialist) {
        $specialist.find('span').html(ticket.assignedSpecialist)
        $specialist.show();
      } else {
        $specialist.hide();
      }
      $sector.children('span').html(getSector(ticket.category))
      $user.children('span').html(ticket.user)
      // description
      $title.html(ticket.title)
      $description.html(ticket.description)

      // Dividir Ticket
      if (ticket.status === 5 || !!ticket.parentTicket) {
        $divideTicketButton.hide()
      } else {
        $divideTicketButton.show()
      }

      // Botones Modal
      if (ticket.status === 3 || ticket.status === 4) {
        $actions.hide()
      } else {
        $actions.show()
        $deleteButton.data('id', ticket._id)
        $cancelButton.data('id', ticket._id)
        $resolveButton.data('id', ticket._id)
        $divideButton.data('id', ticket._id)
        $assignButton.data('id', ticket._id)
      }
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

function actualizaSector(button) {
  var data = {
    sector: $(button).siblings('select').val(),
    specialist: $(button).data('username')
  }

  $.ajax({
    type: 'PUT',
    url: '/specialist/updatesector',
    data: data,
    success: function () {
      location.reload()
    }
  })
}