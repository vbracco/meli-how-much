$(document).ready(function () {
  let apiCategories = "https://api.mercadolibre.com/sites/MLA/categories";

  $.getJSON(apiCategories, function (categories) {
    for (let category of categories) {
      $("#hidden_categories").append(new Option(category.name, category.id));
    }
    $("#hidden_categories option:first").attr("disabled", "disabled");
  });

  $("#search").keyup(function () {
    if (!$(this).val()) {
      $("#main-btn").hide();
    } else {
      $("#main-btn").show();
    }
  });

  $('#search').on('keypress',function(e) {
    if(e.which == 13) {
        $('#main-btn').click();
        return false;
    }
    return true;
});

  $("#main-btn").click(function () {
    $(".product-img").fadeOut();

    const product = $("#search").val();
    const condition = $("input:radio[name=condition]:checked").val();
    const site = "MLA";

    $("#result").html("<p>Buscando&hellip;</p>")
    const url = `https://api.mercadolibre.com/sites/${site}/search?status=active&q=${product}&limit=50&condition=${condition}&buying_mode=buy_it_now`;
    $.getJSON(url, function (data) {
      if (typeof data.results === "undefined") {
        $("#result").html("<p>No encontré nada parecido.</p>").show();
      } else {
        const quantity = data.results.length;

        if (!quantity) {
          $("#result").html("<p>No encontré nada parecido.</p>").show();
          return false;
        }

        const total = parseInt(
          data.results.reduce((sum, item) => sum + item.price, 0)
        );

        const average = parseInt(parseInt(total / quantity) / 100) * 100;

        const moreExpensives = data.results.filter(
          ({ price }) => price > average
        );

        const lessExpensives = data.results.filter(
          ({ price }) => price < average
        );

        const moreExpensivesAverage =
          parseInt(
            parseInt(
              moreExpensives.reduce((sum, item) => sum + item.price, 0) /
                moreExpensives.length
            ) / 100
          ) * 100;

        let lessExpensivesAverage =
          parseInt(
            parseInt(
              lessExpensives.reduce((sum, item) => sum + item.price, 0) /
                lessExpensives.length
            ) / 100
          ) * 100;

        $("#result").html(
          `<p>En promedio se pueden vender a: <span class="price">$ ${average.toLocaleString()}</span></p><p>Desde <strong>$${lessExpensivesAverage.toLocaleString()}</strong> hasta <strong>$${moreExpensivesAverage.toLocaleString()}</strong>.</p>`
        );
        $("#result").show();
      }
    });
  });
});
