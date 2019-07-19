$(document).ready(function() {
  svg4everybody({});
  new VueCalendar().init();
});

function VueCalendar() {
  this.state = {
    calendarFilled: false,
    firstInit: true,
    datepicker: null,
    totalQuantity: 0,
    totalQuantity2: 0,
    filledDates: {},
    check: true,
    inFilledDates: ""
    // maxDate: 0,
    // currMonth: Number(3) || 0
  };
  this.vue = {};

  this.$el = {
    onPage: {
      quantityControl: null
    },

    dialog: null,
    calendar: null,

    datepicker: null,
    infobox: null,
    enterbox: null,
    enterboxForm: null,
    enterboxInput: null,
    productCollapse: null,
    resetBtn: null,
    saveBtn: null
  };

  const VueCalendar = this;

  // Создаем массив товаров из тайл апплета
  this._makeVue = function() {
    const VueCalendar = this;

    this.vue = new Vue({
      el: "#productCollapse",
      data: function() {
        // first init
        return {
          products: this.loadData(), // получить данные
          selectedProduct: "all" // '', 'all', 'productID'
        };
      },
      computed: {
        summaryCount: function() {
          return this.getSummaryCount();
        }
      },
      methods: {
        activate: function(el) {
          this.selectedProduct = el;
          this.renderDatapicker();
          if (el !== "all") {
            this.refreshCounter();
          }
        },

        /**
         * При изменении/удалении тоннажа (запускается в onSelectDate при submit и reset)
         * @param {String} selectedDate
         * @param {String} value
         */
        onChange: function(selectedDate, value) {
          // 1. изменение
          // if (value == 0 ) {
          //   delete this.products[this.selectedProduct].filledDates[selectedDate]; console.log(value);
          // }
          if (Number.isNaN(value)) {
            this.products[this.selectedProduct].filledDates[selectedDate] = 0;
          }
          if (
            value === "" &&
            this.products[this.selectedProduct].filledDates[selectedDate]
          )
            delete this.products[this.selectedProduct].filledDates[
              selectedDate
            ];
          else
            this.products[this.selectedProduct].filledDates[
              selectedDate
            ] = +value;
          // console.log(value)

          // 2. перерасчёт
          this.refreshCounter();
          // 3. Сохранить в БД
          const tempScrollTop = $(window).scrollTop();
          this.saveData(selectedDate, value);
          $(window).scrollTop(tempScrollTop);
        },

        onProductTonsChange: function(prodId, value) {
          this.products[prodId].total.haveToFill = value;
          // this.refreshCounter();
        },

        onDeleteProduct: function(prodId) {
          delete this.products[prodId];
          // this.refreshTotalRemaining();
        },

        /**
         * Обновление счётчика оставшихся тон для заполнения
         */
        refreshCounter: function() {
          const that = this;
          const getFilled = Object.values(
            that.products[that.selectedProduct].filledDates
          ).reduce(function(acc, num) {
            return acc + num;
          }, 0);

          const haveToFill = this.products[this.selectedProduct].totalCount
            .haveToFill;
          const filled = getFilled;
          const remaining = haveToFill - filled;
          // console.log(haveToFill);
          const totalCount = {
            haveToFill: haveToFill,
            filled: filled,
            remaining: Math.round(remaining * 1000) / 1000 // Task-389 Неверный расчет остатка при вводе дробного кол-ва продукта на отгрузку  290319
          };
          this.products[this.selectedProduct].totalCount = totalCount;

          // console.log(totalCount)
        },

        getSummaryCount: function() {
          const that = this;
          const getHaveToFill = Object.values(that.products).reduce(function(
            acc,
            prod
          ) {
            return acc + prod.totalCount.haveToFill;
          },
          0);
          const getFilled = Object.values(that.products).reduce(function(
            acc,
            prod
          ) {
            return (
              acc +
              Object.values(prod.filledDates).reduce(function(acc, num) {
                return acc + num;
              }, 0)
            );
          },
          0);

          const getfilledDates = function() {
            const allDatesArr = [];
            Object.keys(that.products).forEach(function(key) {
              const dates = that.products[key].filledDates;
              for (let date in dates) {
                const obj = {};
                obj[date] = dates[date];
                allDatesArr.push(obj);
              }
            });

            const datesSum = allDatesArr.reduce(function(a, b) {
              for (let i in b) {
                if (!a[i]) {
                  a[i] = [];
                }

                a[i].push(b[i]);
              }

              return a;
            }, {});
            Object.keys(datesSum).forEach(function(key) {
              datesSum[key] = datesSum[key].reduce(function(a, b) {
                return a + b;
              });
            });
            return datesSum;
          };

          const haveToFill = getHaveToFill;
          const filled = getFilled;
          const remaining = haveToFill - filled;
          const filledDates = getfilledDates();

          return {
            haveToFill: haveToFill,
            filled: filled,
            remaining: Math.round(remaining * 1000) / 1000, // Task-389 Неверный расчет остатка при вводе дробного кол-ва продукта на отгрузку  290319
            filledDates: filledDates
          };
        },

        loadData: function() {
          const tileSet = [
            {
              Id: "1-3NDXI3",
              "Quantity Requested": "15",
              "Product Class Display": "Полипропилен 1"
            },
            {
              Id: "1-3NDXHT",
              "Quantity Requested": "13",
              "Product Class Display": "Полипропилен 2"
            }
          ];

          const productList = {};
          this.$root.calDataAll = {
            "1-3NDXI3": {
              name: "Полипропилен 1",
              totalCount: { haveToFill: 1, filled: 1, remaining: 0 },
              filledDates: { "05/25/2019": 1 }
            },
            "1-3NDXHT": {
              name: "Полипропилен 2",
              totalCount: { haveToFill: 1, filled: 1, remaining: 0 },
              filledDates: { "05/19/2019": 1 }
            }
          };
          let calDataAll = {};
          if (localStorage.calDataAll) {
            calDataAll = JSON.parse(localStorage.calDataAll);
          } else {
            calDataAll = this.$root.calDataAll;
          }

          tileSet.forEach(function(tile) {
            productList[tile["Id"]] = {
              name: tile["Product Class Display"],
              totalCount: {
                haveToFill: Number(tile["Quantity Requested"]),
                filled: 0,
                remaining: 0
              },
              filledDates:
                tile["Id"] in calDataAll
                  ? calDataAll[tile["Id"]].filledDates
                  : {}
            };
          });

          // обновляем счетчики
          Object.keys(productList).forEach(function(product) {
            const getFilled = Object.values(
              productList[product].filledDates
            ).reduce(function(acc, num) {
              return acc + num;
            }, 0);

            const haveToFill = productList[product].totalCount.haveToFill;
            const filled = getFilled;
            const remaining = haveToFill - filled;
            const totalCount = {
              haveToFill: haveToFill,
              filled: filled,
              remaining: Math.round(remaining * 1000) / 1000 // Task-389 Неверный расчет остатка при вводе дробного кол-ва продукта на отгрузку  290319
            };
            productList[product].totalCount = totalCount;
          });

          return productList;
        },
        renderDatapicker: function() {
          VueCalendar.$el.datepicker.data("datepicker").clear();
          return VueCalendar.initDatepicker();
        },

        saveData: function(selectedDate, value) {
          const tempScrollTop = $(window).scrollTop();
          const that = this;

          Object.keys(this.products).forEach(function(prodKey, i) {
            const productDates = that.products[prodKey].filledDates;
            Object.keys(productDates).forEach(function(key, i) {
              if (productDates[key] == 0) delete productDates[key];
            });
          });
          /**
           * Брать ID товара и сравнивать с ID Quote Item, записывать в CalendarData
           */

          localStorage.calDataAll = JSON.stringify(that.products);
        }
      }
    });
  };
  /**
   * Initialisation of the Class
   */

  this.init = function() {
    this.onOpenDialog();
  };

  this.onBlurInputEnterbox = function(event) {
    this.$el.enterboxForm.submit();
  };

  this.onSubmitEnterbox = function(event) {
    event.preventDefault();

    const $infobox = $(
      ".datepicker--cell-day.-selected- .jsInfobox",
      this.$el.calendar
    );

    if (!this.$el.enterboxInput[0].validity.valid) {
      return;
    }

    const $selected = $(".-selected- > small", this.$el.calendar);

    const date = this.state.datepicker.lastSelectedDate;
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const dateUSAFormat = date
      .toLocaleDateString("en-US", options)
      .replace(
        /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
        ""
      ); // Task 419 IE invalid date bug  18.04.19

    let value = this.fixNumber(this.$el.enterboxInput.val());

    this.vue.onChange(dateUSAFormat, value);

    const quantity = value > 0 ? this.fixNumber(value) + " т." : ""; // Task-287 calendar translations TAUSHEVA 12.12.18
    $selected.text(quantity);
    setTimeout(function() {
      $infobox.hide();
    }, 500); // Task 391
  };
  this.onDeleteInput = function(event) {
    event.preventDefault();
    const $infobox = $(
      ".datepicker--cell-day.-selected- .jsInfobox",
      this.$el.calendar
    );
    const $selected = $(".-selected- > small", this.$el.calendar);
    const date = this.state.datepicker.lastSelectedDate;
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const dateUSAFormat = date
      .toLocaleDateString("en-US", options)
      .replace(
        /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
        ""
      ); // Task 419 IE invalid date bug  18.04.19
    this.$el.enterboxInput.val("");
    $selected.text("");
    const value = this.fixNumber(this.$el.enterboxInput.val());
    this.vue.onChange(dateUSAFormat, 0);
    $infobox.hide();
  };
  this.onOpenDialog = function() {
    if (this.state.firstInit) {
      this._putTemplateToBody();
      this._makeVue();
      this._selectElementsInDOM();
      this.initDatepicker();

      this.state.firstInit = false;
    } else {
      this.updateDatepicker();
    }
  };

  this.onSelectDate = function(formattedDate, date, inst) {
    const that = this;
    const InfoBoxTemplate =
      '<div class="jsInfobox calendar-box calendar-box_info">' +
      '<div class="jsEnterbox  calendar-box_enter">' +
      '<form class="jsEnterboxForm">' +
      '<input id="jsEnterBoxInput" class="form-control jsEnterboxInput field_md " placeholder="Кол-во  т." type="number"  step="0.001" min="0.025">' +
      '<button class="jsSubmitBtn btn btn-primary btn-submit" type="submit">Добавить</button>' +
      '<button class="btn del-btn btn-light"  type="reset"></button>' +
      "</form>" +
      "</div>" +
      "</div>";

    // async function (to init below code after datepicker's default actions)
    setTimeout(function() {
      const $selected = $(
        ".datepicker--cell-day.-selected- ",
        that.$el.calendar
      );
      $selected.append(InfoBoxTemplate);
      const $infobox = $(
        ".datepicker--cell-day.-selected- .jsInfobox",
        that.$el.calendar
      );

      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      };
      const dateUSAFormat = date
        .toLocaleDateString("en-US", options)
        .replace(
          /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
          ""
        ); // Task 419 IE invalid date bug  18.04.19

      // Чтобы не закрывался попап при нажатии на popdown
      $infobox.on("click", function(event) {
        event.stopPropagation();
      });
      $infobox.show(200);
      that.$el.enterboxInput = $("#jsEnterBoxInput", that.$el.calendar);
      that.$el.enterboxForm = $(".jsEnterboxForm", that.$el.calendar);
      that.$el.enterboxInputFilled = $(that.$el.enterboxInput, ".-filled-");
      that.$el.enterboxForm.on("submit", that.onSubmitEnterbox.bind(that));
      that.$el.enterboxInput.on("blur", that.onBlurInputEnterbox.bind(that));
      that.$el.enterboxForm.on("reset", that.onDeleteInput.bind(that));

      if (date instanceof Date) {
        const dateValue = $(".-selected- > small", that.$el.calendar).text();
        let dateTons = dateValue.slice(0, -3);

        if (
          that.vue.products[that.vue.selectedProduct].totalCount.remaining <= 0
        ) {
          const max =
            that.vue.products[that.vue.selectedProduct].totalCount.remaining;

          that.$el.enterboxInput
            .val(dateTons)
            .attr("max", max)
            .trigger("input");
        }

        // if (calendar filled up AND dateTons is not filled) { hide enterbox and return }
        // else                                               { show enterbox }

        if (that.state.calendarFilled === true && +dateTons === 0) {
          that.$el.enterbox.hide();
          return;
        }
        // Set value from the data to enterbox input
        (function() {
          that.vue.onChange(dateUSAFormat, 0);

          const max = that.fixNumber(
            that.vue.products[that.vue.selectedProduct].totalCount.remaining
          );
          // console.log(max, that.vue.products[that.vue.selectedProduct].totalCount.remaining );
          that.$el.enterboxInput
            .val(dateTons)
            .attr("max", max)
            .trigger("input");
        })();

        that.$el.enterboxInput.focus();
      }
    });
  };

  this.onRenderDatepickerCell = function(date, cellType) {
    if (cellType === "day") {
      const currentDate = date.getDate();
      let carlabel = "";
      let carlabelOther = "";
      let quantity = "";

      if (this.state.filledDates) {
        const options = {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        };
        const dateUSAFormat = date
          .toLocaleDateString("en-US", options)
          .replace(
            /[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g,
            ""
          ); // Task 419 IE invalid date bug  18.04.19
        let inFilledDatesAll = this.vue.summaryCount.filledDates[dateUSAFormat];
        let inFilledDates = "";
        if (this.vue.selectedProduct == "all") {
          inFilledDates = this.vue.summaryCount.filledDates[dateUSAFormat];
          this.$el.datepicker.addClass("allProdView");
        } else {
          inFilledDates = this.vue.products[this.vue.selectedProduct]
            .filledDates[dateUSAFormat];
          this.$el.datepicker.removeClass("allProdView");
        }
        // const inFilledDatesAll = this.vue.products.filledDates[dateUSAFormat];
        // console.log(this.vue.products[this.vue.selectedProduct].filledDates[dateUSAFormat])

        quantity = inFilledDates ? this.fixNumber(inFilledDates) + " т." : ""; // Task-287 calendar translations TAUSHEVA 12.12.18
        carlabel = inFilledDates ? "carlabel " : ""; // иконка машинки

        carlabelOther = inFilledDatesAll ? "carlabel-other " : "ddd"; // иконка машинки для других дат

        const that = this;

        setTimeout(function() {
          $(".carlabel-other", that.$el.calendar)
            .addClass("tooltip-car")
            .parent()
            .addClass("-filled-other-");
          $(".carlabel", that.$el.calendar)
            .removeClass("carlabel-other tooltip-car")
            .parent()
            .addClass("-filled-");
        });
      }

      return {
        html:
          currentDate +
          "<small>" +
          quantity +
          "</small>" +
          '<p class="carempty ' +
          carlabel +
          carlabelOther +
          ' " data-tooltip-car="В этот день запланированы другие отгрузки"></p>'
      };
    }
  };

  this.initDatepicker = function(field_value) {
    const _aDay = 1000 * 60 * 60 * 24;
    const _days = 0;
    const plusDays = _aDay * _days;

    const minDate = new Date(Date.now() + plusDays);
    const now = new Date();
    // const currMonth = Number(field_value) || Number(5);
    // const maxDate = new Date(now.getFullYear(), currMonth, 0);
    // this.$el.datepicker.datepicker().data("datepicker").date = maxDate;

    this.$el.datepicker.datepicker({
      language: "ru", // Task-287 calendar translations TAUSHEVA 12.12.18
      minDate: minDate,
      // maxDate: maxDate,

      inline: true,
      toggleSelected: false,
      showOtherYears: false,
      showOtherMonths: false,
      dateFormat: "mm/dd/yyyy",
      navTitles: {
        days: "MM yyyy"
      },

      // events
      onSelect: this.onSelectDate.bind(this),
      onRenderCell: this.onRenderDatepickerCell.bind(this)
    });

    this.state.datepicker = this.$el.datepicker.data("datepicker");
    this.state.filledDates = {};
    const that = this;

    // Task-393 Фокус товара сохраняется при смене позиций,  270319
    // $(".pr-list-item").on("click", function() {
    //   $(".-selected-", that.$el.calendar).removeClass("-selected-");
    // });
  };

  this.updateDatepicker = function() {
    this.clearDatepicker();
    this.toggleBoxes();
  };

  this.clearDatepicker = function() {
    this.state.datepicker.clear();
    $(".-focus-", this.$el.datepicker).removeClass("-focus-");
  };

  this.updateLabel = function() {
    const remainingQuantity = this.fixNumber(
      this.vue.products[this.vue.selectedProduct].totalCount.remaining
    );

    if (remainingQuantity > 0) {
      this.state.calendarFilled = false;
    } else if (remainingQuantity == 0) {
      this.state.calendarFilled = true;
    } else if (remainingQuantity < 0) {
      this.state.calendarFilled = false;
    } else {
      this.state.calendarFilled = true;
    }
  };

  this.fixNumber = function(number) {
    number = number.toString().replace(",", ".");
    number = +number;
    number = number.toFixed(3);
    number = parseFloat(number);
    return number;
  };

  this._selectElementsInDOM = function() {
    this.$el.calendar = $("#calendar");

    this.$el.datepicker = $(".jsDatepicker", this.$el.calendar);
    this.$el.infobox = $(".jsInfobox", this.$el.calendar);
    this.$el.enterbox = $(".jsEnterbox", this.$el.calendar);
    this.$el.quantity = $(".quantity", this.$el.calendar);
    this.$el.enterboxInput = $(".jsEnterboxInput", this.$el.calendar);

    this.$el.submitBtn = $(".jsSubmitBtn", this.$el.calendar);
  };

  this.toggleBoxes = function(showEnterBox) {
    const display = {
      infobox: "",
      enterbox: "none"
    };

    // if argument showEnterBox passed or there are filledDates by user
    // - then toggle display states
    if (showEnterBox) {
      display.infobox = "none";
      display.enterbox = "";
    }

    this.$el.infobox.css("display", display.infobox);
    this.$el.enterbox.css("display", display.enterbox);
  };
  this._putTemplateToBody = function() {
    const template = this._getTemplate();
    $(".wide-box").html(template);
  };

  this._getTemplate = function() {
    const template =
      '<div id="calendar" class="new-calendar">' +
      '<div class="calendar__content row">' +
      '<div class="col-md-6 calendar__sidebar">' +
      '<div id="productCollapse">' +
      '<ul id="pr-list">' +
      ' <li class="pr-list-item" @click="activate(\'all\')" :class="{ active : selectedProduct == \'all\'}"> <span class="product-title">' +
      "Все товары" +
      "</span>" +
      ' <span v-if="summaryCount.remaining > 0" class="totalquantity quantity"> ' +
      "Осталось " +
      " <i> {{ summaryCount.remaining }}" +
      " " +
      " т." +
      "</i></span>" +
      ' <span v-else-if="summaryCount.remaining < 0" class=" quantity over">' +
      "Превышено " +
      " {{ summaryCount.filled - summaryCount.haveToFill }} " +
      " " +
      " т." +
      " </i></span>" +
      ' <span v-else-if="Number.isNaN(summaryCount.remaining)" class=" quantity over"  > ' +
      "Введено нечисловое значение" +
      " </i></span>" +
      ' <span v-else class=" quantity totals">' +
      "Все распределено" +
      "</i></span></li>" +
      ' <li class="pr-list-item" v-for="(product, index) in products" :key="index" @click="activate(index)" :class="{ active : selectedProduct == index}"> <span class="product-title">{{ product.name }}' +
      "</span>" +
      ' <span v-if="product.totalCount.remaining > 0" class="quantity"> ' +
      "Осталось " +
      " <i> {{ product.totalCount.remaining }} " +
      " " +
      " т." +
      "</i></span>" +
      '<span v-else-if="product.totalCount.remaining < 0" class=" quantity over">' +
      "Превышено " +
      "{{ product.totalCount.filled - product.totalCount.haveToFill }} " +
      "  " +
      " т." +
      "</i></span>" +
      ' <span v-else-if="Number.isNaN(summaryCount.remaining)" class=" quantity over">' +
      "Введено нечисловое значение" +
      " </i></span>" +
      ' <span v-else class=" quantity totals">' +
      "Все распределено" +
      "</i></span></li>" +
      " </ul>" +
      ' <div class="ItemHelpText" >' +
      ' <div class="ItemHelpTextCommon "><span id="Date_HelpText_Label"> ' +
      "Вы можете распределить оставшийся товар позже. Менеджер позвонит вам для уточнения дат отгрузки нераспределенного товара." +
      "</span></div>" +
      " </div>" +
      "</div>" +
      "</div>" +
      '<div class="col-md-6 jsDatepicker calendar__datepicker"></div>' +
      "</div>";
    return template;
  };

  return this;
}
