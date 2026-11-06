/* Consistent English/Russian demo copy. Business identifiers and visitor input are preserved. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.QuarkOnboardingLocales = factory();
})(typeof window === "object" ? window : this, function () {
  "use strict";
  const ru = {
    "AI onboarding · guided demo": "AI-онбординг · интерактивное демо",
    "Local RF simulation": "Локальная симуляция ТСД",
    "Setup assistant": "Помощник по настройке",
    "Configure · simulate · improve": "Настраиваем · проверяем · улучшаем",
    Activity: "События",
    Live: "В реальном времени",
    LIVE: "СОБЫТИЯ",
    Chat: "Чат",
    RF: "ТСД",
    "Message to setup assistant": "Сообщение помощнику",
    "Send message": "Отправить сообщение",
    "Attach warehouse plan": "Прикрепить план склада",
    "Remove plan": "Убрать план",
    "Toggle theme": "Сменить тему",
    "Reset demo": "Начать заново",
    "Collapse chat": "Свернуть чат",
    "Show activity": "Показать события",
    "Continue setup chat": "Продолжить разговор",
    "Answer or ask Quark AI…": "Ответьте или задайте вопрос Quark AI…",
    Privacy: "Конфиденциальность",
    "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
      "В Quark AI отправляются только ваши сообщения и выбранные файлы. Ответы кнопками и действия ТСД остаются на этой странице.",
    "What do you store?": "Что хранится на складе?",
    "Ordinary goods": "Обычные товары",
    "Goods with expiry dates": "Товары со сроком годности",
    "Serial-controlled goods": "Товары с серийными номерами",
    "How are goods handled?": "В какой таре хранится товар?",
    "Pallets, cases and units": "Паллеты, короба и штуки",
    "Cases and units": "Короба и штуки",
    "Do operators scan product barcodes during receiving?":
      "Сканируется ли штрихкод товара при приёмке?",
    "Yes, product scan is required": "Да, сканирование товара обязательно",
    "Not consistently yet": "Пока не всегда",
    "How is quantity confirmed?": "Как подтверждается количество?",
    "Enter the quantity": "Вводим количество вручную",
    "Scan each unit": "Сканируем каждую единицу",
    "Who chooses the putaway location?": "Кто выбирает ячейку размещения?",
    "The WMS suggests a location": "Ячейку предлагает WMS",
    "The operator chooses": "Ячейку выбирает кладовщик",
    "How do operators pick orders?": "Как отбираются заказы?",
    "One order at a time": "По одному заказу",
    "In waves": "Волнами",
    "Do you check the product before packing is completed?":
      "Проверяется ли товар перед завершением упаковки?",
    "Yes, product check required": "Да, проверка товара обязательна",
    "Not currently": "Пока нет",
    "Use General Distribution sample":
      "Использовать пример дистрибуционного склада",
    "The sample includes one expiry-dated milk line. No serial capture.":
      "В примере есть молоко со сроком годности. Серийный учёт не используется.",
    "Confirmed warehouse facts": "Подтверждённые особенности склада",
    "Lot policy": "Политика партий",
    "Lot creation": "Создание партии",
    "Receiving lot attributes": "Атрибуты партии при приёмке",
    "Required at receiving": "Обязательные при приёмке",
    Existing: "Использовать существующую партию",
    "Prepare mobile processes →": "Настроить мобильные процессы →",
    "Warehouse model confirmed": "Модель склада определена",
    "Operator permissions configured": "Права кладовщика настроены",
    "Receiving example prepared": "Приёмка подготовлена",
    "Putaway example prepared": "Размещение подготовлено",
    "Picking example prepared": "Отбор подготовлен",
    "→ Preparing the virtual handheld": "→ Подготавливаю виртуальный ТСД",
    Before: "До",
    After: "После",
    "Unknown product barcode": "Неизвестный штрихкод товара",
    "No recovery rule": "Нет сценария восстановления",
    "Block and offer retry": "Блокировать и предложить повтор",
    "Target location scan": "Сканирование целевой ячейки",
    "Optional in test variant": "Необязательно в тестовом варианте",
    Required: "Обязательно",
    "Product check before pick completion":
      "Проверка товара перед завершением отбора",
    "Apply correction & retry →": "Применить исправление и повторить →",
    "Apply correction & retry": "Применить и повторить",
    "Test putaway →": "Проверить размещение →",
    "Test picking →": "Проверить отбор →",
    "Customize the handheld →": "Настроить внешний вид ТСД →",
    "Make the handheld fit your team": "Настройте ТСД под свою команду",
    "Larger text": "Крупный текст",
    "Hide extra fields": "Скрыть лишние поля",
    "Show sample product illustration": "Показывать изображение товара",
    "Play an error sound": "Звуковой сигнал ошибки",
    "Enable short action codes": "Короткие коды действий",
    "Show why a scan is blocked": "Показывать причину блокировки",
    "Confirm quantity before completion":
      "Подтверждать количество перед завершением",
    "Handheld language": "Язык демо и терминалов",
    "Action controls and menu headings switch language; sample product identifiers stay unchanged.":
      "Язык чата и обоих терминалов меняется вместе. Артикулы и коды остаются прежними.",
    "Check operator permissions →": "Проверить права кладовщика →",
    "Warehouse Operator": "Кладовщик",
    "Excluded from the operator role:": "Недоступно кладовщику:",
    Administration: "Администрирование",
    "Policy changes": "Изменение политик",
    "User management": "Управление пользователями",
    "Financial data": "Финансовые данные",
    "Unassigned operations": "Неназначенные операции",
    "This checks the simulated menu, not access to a live system.":
      "Проверяем меню роли в этой симуляции.",
    "Review onboarding result →": "Посмотреть результат настройки →",
    "Warehouse mobile configuration ready":
      "Мобильные процессы склада настроены",
    "Guided demo results · sample warehouse only":
      "Результаты демо на примере склада",
    "Receiving — Validated in demo": "Приёмка — проверена в демо",
    "Putaway — Validated in demo": "Размещение — проверено в демо",
    "Picking — Validated in demo": "Отбор — проверен в демо",
    "Barcode controls — Enabled": "Контроль штрихкодов — включён",
    "Location verification — Required": "Проверка ячейки — обязательна",
    "Operator permissions — Verified in demo":
      "Права кладовщика — проверены в демо",
    "TSD layout — Customized": "Вид ТСД — настроен",
    "Business scenarios — 3/3 passed": "Бизнес-сценарии — пройдено 3 из 3",
    "Discuss my setup · leave work email →":
      "Обсудить настройку — оставить email →",
    "Review configuration": "Посмотреть конфигурацию",
    "Replay simulation": "Повторить симуляцию",
    "Approve onboarding result": "Подтвердить результат настройки",
    "Demo result acknowledged. No activation was performed.":
      "Результат демо подтверждён. Склад не активирован.",
    Receiving: "Приёмка",
    Putaway: "Размещение",
    Picking: "Отбор",
    "Receiving · Putaway · Picking": "Приёмка · Размещение · Отбор",
    "Receiving, Putaway, Picking": "Приёмка, Размещение, Отбор",
    "✓ Receiving · Putaway · Picking": "✓ Приёмка · Размещение · Отбор",
    "Your mobile processes": "Ваши мобильные процессы",
    "Confirm warehouse facts in chat to prepare the sample.":
      "Подтвердите особенности склада в чате.",
    "Confirm warehouse facts in chat.":
      "Подтвердите особенности склада в чате.",
    "Waiting for warehouse facts": "Ожидаю описание склада",
    "Preparing the sample configuration": "Подготавливаю конфигурацию примера",
    "Discover warehouse": "Знакомство со складом",
    "Prepare mobile processes": "Настройка мобильных процессов",
    "Customize the handheld": "Настройка ТСД",
    "Check operator access": "Проверка прав",
    "Demo checks complete": "Проверки демо завершены",
    "Demo result acknowledged": "Результат демо подтверждён",
    "Review sample result": "Результат проверки",
    Pallet: "Паллета",
    Product: "Товар",
    Attributes: "Атрибуты",
    "Capture attributes during receiving":
      "Ввод атрибутов при приёмке",
    "LPN entry": "Ввод LPN",
    "Receiving unit": "Единица приёмки",
    "Whole pallets": "Целые паллеты",
    "Receiving location": "Ячейка приёмки",
    "Receiving location scan": "Сканирование ячейки приёмки",
    "Not required": "Не требуется",
    "Product barcode": "Штрихкод товара",
    "Attribute value is required.": "Введите значение атрибута.",
    Expected: "Ожидается",
    Contents: "Содержимое",
    "Suggested bin": "Предложенная ячейка",
    Order: "Заказ",
    Source: "Исходная ячейка",
    Quantity: "Количество",
    "Quantity (EA)": "Количество (шт.)",
    "Expiry date": "Срок годности",
    "Scan pallet": "Отсканируйте паллету",
    "Scan product": "Отсканируйте товар",
    "Confirm expected quantity": "Подтвердите ожидаемое количество",
    "Enter expiry date": "Введите срок годности",
    "Complete receipt": "Завершить приёмку",
    "Scan suggested location": "Отсканируйте предложенную ячейку",
    "Confirm putaway": "Подтвердить размещение",
    "Scan source location": "Отсканируйте исходную ячейку",
    "Confirm pick quantity": "Подтвердите количество отбора",
    "Confirm pick line": "Подтвердить строку отбора",
    "Review the accepted scans and complete this step.":
      "Проверьте принятые сканирования и подтвердите шаг.",
    "Sample zone match · free capacity. Target scan verifies the suggested bin.":
      "В примере выбраны подходящая зона и свободная вместимость. Сканирование проверяет предложенную ячейку.",
    "Controlled error test": "Проверка ошибки",
    "Try a wrong barcode before accepting the correct scan.":
      "Сначала проверьте неверный штрихкод, затем отсканируйте правильный.",
    "Try a wrong bin before accepting the correct scan.":
      "Сначала проверьте неверную ячейку, затем отсканируйте правильную.",
    "Scan UNKNOWN-999": "Сканировать UNKNOWN-999",
    "Scan A-02-04": "Сканировать A-02-04",
    Scan: "Сканировать",
    Confirm: "Подтвердить",
    "Unknown product barcode. Please retry.":
      "Неизвестный штрихкод товара. Повторите сканирование.",
    "Wrong location. Expected A-01-02.": "Неверная ячейка. Ожидается A-01-02.",
    "Enter a valid future expiry date.":
      "Введите корректный будущий срок годности.",
    "Task complete": "Задание завершено",
    "Sample checks passed": "Проверки примера пройдены",
    "No live warehouse changes": "Реальный склад не изменялся",
    "Review the configuration change in chat":
      "Посмотрите изменение настройки в чате",
    "Live layout preview": "Предпросмотр интерфейса",
    "Handheld layout preview": "Предпросмотр ТСД",
    "Preview only · no stock change": "Предпросмотр без изменения остатков",
    "Test error feedback": "Проверить сигнал ошибки",
    "Operator menu": "Меню кладовщика",
    "Assigned process": "Доступный процесс",
    "Only assigned warehouse tasks.": "Только назначенные складские задания.",
    "No administration access.": "Нет доступа к администрированию.",
    "Simulated role · 3 processes": "Роль в демо · 3 процесса",
    Handheld: "Ручной ТСД",
    Forklift: "Терминал погрузчика",
    "GUIDED SIMULATION": "ИНТЕРАКТИВНОЕ ДЕМО",
    "QUARK / GUIDED SIMULATION": "QUARK / ИНТЕРАКТИВНОЕ ДЕМО",
    "SAMPLE CHECKS PASSED": "ПРОВЕРКИ ПРИМЕРА ПРОЙДЕНЫ",
    "WAREHOUSE OPERATOR": "КЛАДОВЩИК",
    "Continue on the handheld": "Продолжайте на ТСД",
    "Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.":
      "Выполняйте действия кнопками ТСД. Результаты появятся в журнале событий.",
    Role: "Роль",
    Processes: "Процессы",
    "Target scan": "Целевая ячейка",
    "Product check": "Проверка товара",
    Activation: "Активация",
    "Separate administrator step": "Отдельный этап для администратора",
    "Quark AI is replying…": "Quark AI отвечает…",
    Stop: "Остановить",
    "Retry AI": "Повторить запрос к AI",
    "Earlier AI reply. Ask again in this language.":
      "Предыдущий ответ AI был на другом языке. Задайте вопрос на выбранном языке.",
    "Continue with your warehouse setup": "Продолжить настройку склада",
    "Send this example to the Quark team. We will follow up about your warehouse.":
      "Отправьте пример команде Quark. Мы свяжемся с вами и обсудим ваш склад.",
    "Work email": "Рабочий email",
    Company: "Компания",
    "Send my contact details and this demo setup to Quark for follow-up.":
      "Согласен отправить контактные данные и этот пример настройки в Quark для обратной связи.",
    "Privacy policy": "Политика конфиденциальности",
    "Send my setup to Quark →": "Отправить настройку в Quark →",
    Close: "Закрыть",
    "Review sample configuration": "Конфигурация примера",
    "Configured controls": "Настроенные проверки",
    "No production activation or live permissions test.":
      "Активация склада и проверка прав в реальной системе не выполнялись.",
    "Guided demo started": "Интерактивное демо запущено",
    "Sample data · no live warehouse connection": "Демонстрационные данные",
    "Sample warehouse selected": "Выбран пример склада",
    "Includes an expiry-dated milk line. No serial numbers.":
      "Есть молоко со сроком годности, без серийного учёта.",
    "Warehouse fact confirmed": "Особенность склада подтверждена",
    "Configuration started": "Настройка начата",
    "Existing process templates; no new business logic generated":
      "Настраиваем существующие процессы",
    "Use Scan, Confirm and Retry yourself":
      "Нажимайте «Сканировать», «Подтвердить» и «Повторить»",
    "Scan blocked": "Сканирование заблокировано",
    "Configuration correction proposed": "Предложено исправление настройки",
    "Correction applied": "Исправление применено",
    "Operator action accepted": "Действие принято",
    "48 EA received": "Принято 48 шт.",
    "48 EA stored at A-01-02": "Размещено 48 шт. в A-01-02",
    "2 lines · 18 EA · sent to Packing":
      "2 строки · 18 шт. · направлено на упаковку",
    "First order line completed": "Первая строка заказа завершена",
    "12 EA picked": "Отобрано 12 шт.",
    "Handheld layout customized": "Вид ТСД настроен",
    "Operator permissions checked": "Права кладовщика проверены",
    "Only three assigned processes visible":
      "Доступны только три назначенных процесса",
    "No activation or production write":
      "Без активации и записи в рабочую систему",
    "Handheld preference changed": "Настройка ТСД изменена",
    "Error feedback preview": "Проверка сигнала ошибки",
    "Visible feedback always shown; audio only when enabled":
      "Ошибка всегда видна на экране; звук включается по выбору",
    "AI reply received": "Получен ответ AI",
    "Explanation and confirmed facts only; no warehouse actions":
      "Пояснение и подтверждённые факты",
    "AI reply unavailable": "Ответ AI недоступен",
    "The controlled simulation remains available":
      "Можно продолжить управляемую симуляцию",
  };
  Object.assign(ru, {
    "Configuration updated": "Настройка обновлена",
    "Retry the expected barcode":
      "Повторите сканирование правильного штрихкода",
    "48 EA · 2 cases × 24": "48 шт. · 2 короба × 24",
    "12 EA": "12 шт.",
    "6 EA": "6 шт.",
    "one unit": "одна единица",
    SCANNER: "СКАНЕР",
    "Demo sections": "Разделы демо",
    "Activity and events": "Журнал событий",
    "Configuration details": "Настройки",
    "Waiting for setup": "Ожидаю описание склада",
    "Configuration · waiting for facts": "Конфигурация · ожидаю описание",
  });
  Object.assign(ru, {
    "SCANNED DESTINATION": "Отсканированная ячейка",
    "Quantity confirmation": "Подтверждение количества",
    Optional: "Необязательно",
    "Action codes": "Коды действий",
    "1 Scan · 2 Confirm": "1 Сканировать · 2 Подтвердить",
  });
  Object.assign(ru, {
    "FORKLIFT TERMINAL · SIMULATION": "ТЕРМИНАЛ ПОГРУЗЧИКА · СИМУЛЯЦИЯ",
    "[SCANNER]": "[СКАНЕР]",
    English: "English",
  });
  Object.assign(ru, {
    "Handheld preferences": "Настройки ТСД",
    On: "Включено",
    Off: "Выключено",
  });
  const long = [
    [
      "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.",
      "Я помогу настроить мобильные процессы склада. Сначала уточню особенности вашей работы, затем вместе проверим приёмку, размещение и отбор на виртуальном ТСД. Выберите пример склада или отвечайте на вопросы по одному.",
    ],
    [
      "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.",
      "Используем дистрибуционный склад: обычные товары и молоко со сроком годности, паллеты, короба и штуки, сканирование товара и ячеек, размещение по указанию WMS, отбор по одному заказу и проверка при упаковке.",
    ],
    [
      "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.",
      "Особенности склада подтверждены. Настрою мобильные процессы и проверю их на демонстрационном товаре.",
    ],
    [
      "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.",
      "Вы используете волны. В коротком демо проверим отбор одного заказа; запуск волн потребует отдельной проверки.",
    ],
    [
      "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.",
      "Вы указали серийный учёт. Этот дистрибуционный пример проверяет товар без серийных номеров. Требование серийного учёта сохранено для обсуждения.",
    ],
    [
      "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.",
      "Проверим приёмку RECV-10042. Отсканируйте паллету PLT-000184, затем товар. Специально попробуем неизвестный штрихкод и проверим повторное сканирование.",
    ],
    [
      "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.",
      "Неизвестный штрихкод отклонён. Добавляю понятную ошибку и повторное сканирование, чтобы кладовщик мог продолжить без создания неизвестного товара.",
    ],
    [
      "Correction applied to this demo configuration. Retry the scan with the expected barcode.",
      "Исправление применено. Повторите сканирование правильного штрихкода.",
    ],
    [
      "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.",
      "Вы указали товары с ограниченным сроком хранения, поэтому я включил ввод срока годности. Дата сохранится с этим товаром в примере.",
    ],
    [
      "Receipt complete. The unknown barcode test now has a clear block-and-retry rule.",
      "Приёмка завершена. Для неизвестного штрихкода настроены блокировка и повторное сканирование.",
    ],
    [
      "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.",
      "Теперь разместим принятую паллету. В примере WMS предлагает ячейку A-01-02 по зоне хранения и свободной вместимости.",
    ],
    [
      "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.",
      "В тестовом варианте сканирование целевой ячейки было необязательным. Проверка обнаружила риск ошибки: делаю сканирование обязательным и запрещаю подмену предложенной ячейки.",
    ],
    [
      "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution.",
      "Размещение завершено. Паллета перемещена целиком вместе с 48 единицами товара. Обязательное сканирование исключило подмену целевой ячейки.",
    ],
    [
      "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.",
      "Проверим отбор заказа SO-10428 по маршруту A-01-02 → B-03-01. Сначала проверим неверный товар, затем отсканируем правильный.",
    ],
    [
      "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.",
      "Неверный товар отклонён. Включаю обязательную проверку товара перед завершением отбора.",
    ],
    [
      "First line verified. Continue to B-03-01 for 6 EA of WATER-500.",
      "Первая строка проверена. Перейдите в B-03-01 и отберите 6 шт. WATER-500.",
    ],
    [
      "Picking complete. Both lines were checked and the sample order is now waiting for Packing.",
      "Отбор завершён. Обе строки проверены, заказ направлен на упаковку.",
    ],
    [
      "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.",
      "Все три сценария пройдены. Настройте ТСД под команду: увеличьте текст, добавьте изображение товара или звук ошибки. Изменения видны сразу.",
    ],
    [
      "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.",
      "Проверим меню кладовщика. В нём только приёмка, размещение и отбор. Администрирование, политики, пользователи и финансовые данные недоступны.",
    ],
    [
      "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.",
      "Конфигурация проверена на трёх бизнес-сценариях примера. Склад не активирован: это отдельный этап после проверки администратором. Оставьте рабочий email, чтобы обсудить настройку с командой Quark.",
    ],
    [
      "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.",
      "Результат демо подтверждён. Ничего не опубликовано. Оставьте email, чтобы обсудить следующие шаги с командой Quark.",
    ],
    [
      "Replaying the same confirmed sample warehouse. No new answers are needed.",
      "Повторяем симуляцию с уже подтверждёнными особенностями склада. Отвечать заново не нужно.",
    ],
    [
      "First run the controlled error test, then apply the correction and retry.",
      "Сначала проверьте ошибку, затем примените исправление и повторите сканирование.",
    ],
    [
      "Run the highlighted error test before finishing this demo process.",
      "Перед завершением процесса выполните выделенную проверку ошибки.",
    ],
  ];
  for (const [en, value] of long) ru[en] = value;
  const dynamic = [
    [/^Receiving RECV-/, "Приёмка RECV-"],
    [/^Putaway PUT-/, "Размещение PUT-"],
    [/^Picking SO-/, "Отбор SO-"],
    [/^Receiving simulation started$/, "Симуляция приёмки начата"],
    [/^Putaway simulation started$/, "Симуляция размещения начата"],
    [/^Picking simulation started$/, "Симуляция отбора начата"],
    [/^Receiving sample passed$/, "Приёмка примера проверена"],
    [/^Putaway sample passed$/, "Размещение примера проверено"],
    [/^Picking sample passed$/, "Отбор примера проверен"],
    [/^Try the receiving task$/, "Выполните приёмку"],
    [/^Try the putaway task$/, "Выполните размещение"],
    [/^Try the picking task$/, "Выполните отбор"],
    [/^(\d+) events$/, "$1 событий"],
    [
      /^Configuration · (\d)\/3 sample processes$/,
      "Конфигурация · $1/3 сценариев",
    ],
    [
      /^CONFIGURATION · (\d)\/3 SAMPLE PROCESSES$/,
      "КОНФИГУРАЦИЯ · $1/3 СЦЕНАРИЕВ",
    ],
    [/^Wrong product\. Expected (.+)\.$/, "Неверный товар. Ожидается $1."],
    [/^Wrong product\. Scan (.+)\.$/, "Неверный товар. Отсканируйте $1."],
    [
      /^Wrong source location\. Expected (.+)\.$/,
      "Неверная исходная ячейка. Ожидается $1.",
    ],
    [/^Wrong pallet\. Expected (.+)\.$/, "Неверная паллета. Ожидается $1."],
    [
      /^Quantity mismatch\. Expected (\d+) EA\.$/,
      "Неверное количество. Ожидается $1 шт.",
    ],
    [/^Expected: /, "Ожидается: "],
    [/^(\d+) \/ 48 units scanned$/, "Отсканировано $1 из 48 шт."],
    [
      /^Sent only with your next AI message$/,
      "Отправится только со следующим сообщением AI",
    ],
    [/^Scan one unit$/, "Сканировать единицу"],
    [
      /^Only assigned warehouse tasks\.$/,
      "Только назначенные складские задания.",
    ],
    [/^\[1\] Receiving$/, "[1] Приёмка"],
    [/^\[2\] Putaway$/, "[2] Размещение"],
    [/^\[3\] Picking$/, "[3] Отбор"],
    [
      /^Product illustration: WebRF view$/,
      "Изображение товара: в режиме WebRF",
    ],
    [
      /^Quantity: 12 EA · confirmation required$/,
      "Количество: 12 шт. · требуется подтверждение",
    ],
    [/^Quantity: 12 EA$/, "Количество: 12 шт."],
    [/^\[1\] SCAN · \[2\] CONFIRM$/, "[1] СКАНИРОВАТЬ · [2] ПОДТВЕРДИТЬ"],
  ];
  Object.assign(ru, {
    "Scan accepted": "Сканирование принято",
    Confirmed: "Подтверждено",
    "Awaiting scan": "Ожидает сканирования",
    "Scanned destination": "Отсканированная ячейка",
    "Demo language": "Язык демо",
    "Sending…": "Отправляю…",
    Sent: "Отправлено",
    "Your setup was accepted. Thank you — the Quark team will follow up.":
      "Настройка принята. Спасибо! Команда Quark свяжется с вами.",
    "The request timed out. Please check before resending.":
      "Ответ не получен вовремя. Проверьте отправку перед повтором.",
    "AI took too long. Your message is kept; retry or use the guided choices.":
      "AI не ответил вовремя. Сообщение сохранено: повторите запрос или продолжите кнопками.",
    "Could not send this setup. Please retry or email hello@quark.build.":
      "Не удалось отправить настройку. Повторите попытку или напишите hello@quark.build.",
    Configuration: "Конфигурация",
    "Sample product illustration": "Изображение товара в примере",
    "Terminal session": "Терминальная сессия",
    "Terminal view": "Режим терминала",
    "Warehouse terminal preview": "Виртуальный ТСД",
    "Choose a JPEG, PNG or PDF up to 3 MB.":
      "Выберите JPEG, PNG или PDF до 3 МБ.",
    "Could not read the file.": "Не удалось прочитать файл.",
    "AI is unavailable. Use the guided choices to continue.":
      "AI недоступен. Продолжите с помощью готовых вариантов.",
    "AI returned an unexpected response. The guided sample is still available.":
      "Получен неожиданный ответ AI. Управляемый пример остаётся доступен.",
  });
  function tr(text, language = "en") {
    if (language !== "ru") return text;
    const padding = text.match(/^(\s*)([\s\S]*?)(\s*)$/),
      lead = padding[1],
      tail = padding[3];
    let value = padding[2];
    if (!value) return text;
    const deviceKey = value.match(/^Device key (.+)$/);
    if (deviceKey) return lead + "Клавиша " + deviceKey[1] + tail;
    if (ru[value]) return lead + ru[value] + tail;
    if (value.includes("\n"))
      return text
        .split("\n")
        .map((t) => tr(t, language))
        .join("\n");
    const mark = value.match(/^([✓○→]\s*)(.*)$/);
    if (mark && ru[mark[2]]) return lead + mark[1] + ru[mark[2]] + tail;
    for (const [pattern, replacement] of dynamic)
      if (pattern.test(value))
        return lead + value.replace(pattern, replacement) + tail;
    if (value.includes(" → "))
      return (
        lead +
        value
          .split(" → ")
          .map((p) => tr(p, language))
          .join(" → ") +
        tail
      );
    const parts = value.split(" · ");
    if (parts.length > 1)
      return lead + parts.map((p) => tr(p, language)).join(" · ") + tail;
    for (const prefix of [
      "Product",
      "Pallet",
      "ORDER",
      "SOURCE",
      "PRODUCT",
      "QUANTITY",
      "PALLET",
      "CONTENTS",
      "SUGGESTED BIN",
      "EXPECTED",
      "ERROR",
    ]) {
      if (value.startsWith(prefix + ": ")) {
        const label =
          {
            ORDER: "Заказ",
            SOURCE: "Исходная ячейка",
            PRODUCT: "Товар",
            QUANTITY: "Количество",
            PALLET: "Паллета",
            CONTENTS: "Содержимое",
            "SUGGESTED BIN": "Предложенная ячейка",
            EXPECTED: "Ожидается",
            ERROR: "Ошибка",
          }[prefix] || ru[prefix];
        return (
          lead +
          label +
          ": " +
          tr(value.slice(prefix.length + 2), language) +
          tail
        );
      }
    }
    let translated = value;
    for (const key of Object.keys(ru)
      .filter((k) => k.length > 8)
      .sort((a, b) => b.length - a.length))
      translated = translated.split(key).join(ru[key]);
    if (translated !== value) return lead + translated + tail;
    const preference = value.match(
      /^(large|simple|image|sound|codes|reasons|quantity|language): (true|false|en|ru)$/,
    );
    if (preference)
      return (
        lead +
        {
          large: "Крупный текст",
          simple: "Короткий экран",
          image: "Изображение товара",
          sound: "Звук",
          codes: "Короткие коды",
          reasons: "Причина блокировки",
          quantity: "Подтверждение количества",
          language: "Язык",
        }[preference[1]] +
        ": " +
        { true: "включено", false: "выключено", en: "English", ru: "Русский" }[
          preference[2]
        ] +
        tail
      );
    return (
      lead +
      value
        .replace(/(\d+) EA/g, "$1 шт.")
        .replace(/line (\d+)\/(\d+)/g, "строка $1/$2") +
      tail
    );
  }
  Object.assign(ru, {
    "{count} events": "{count} событий",
    "Configuration · {count}/3 sample processes":
      "Конфигурация · {count}/3 сценариев",
    "{process} simulation started": "Симуляция «{process}» начата",
    "{process} sample passed": "«{process}»: пример проверен",
    "Try the {process} task": "Выполните процесс «{process}»",
    "Wrong product. Expected {value}.": "Неверный товар. Ожидается {value}.",
    "Wrong source location. Expected {value}.":
      "Неверная исходная ячейка. Ожидается {value}.",
    "Wrong pallet. Expected {value}.": "Неверная паллета. Ожидается {value}.",
    "Quantity mismatch. Expected {count} EA.":
      "Неверное количество. Ожидается {count} шт.",
    "Expected: {value}": "Ожидается: {value}",
    "{count} / 48 units scanned": "Отсканировано {count} из 48 шт.",
    "{count} EA": "{count} шт.",
    "line {current}/{total}": "строка {current}/{total}",
    "{count} Case × {units}": "{count} короба × {units}",
    "Sent only with your next AI message":
      "Отправится только со следующим сообщением AI",
    "{setting}: On": "{setting}: включено",
    "{setting}: Off": "{setting}: выключено",
    "Switch the demo to {language}?": "Переключить всё демо на {language}?",
    "Switch language": "Переключить язык",
    "Keep current language": "Оставить текущий язык",
    "Language switched. Your progress is preserved.":
      "Язык переключён. Ваш прогресс сохранён.",
    receiving: "приёмка",
    putaway: "размещение",
    picking: "отбор",
    "SCANNED DESTINATION": "Отсканированная ячейка",
    "Scan or type": "Сканируйте или введите",
    Loading: "Загрузка",
    Received: "Принято",
    Blocked: "Заблокировано",
    "Configuration details": "Настройки",
    "Demo language": "Язык демо",
    "For this guided sample, I will use the milk example. Your product remains part of the discussion.":
      "В управляемом демо используем пример с молоком. Ваш товар учтён в обсуждении.",
  });
  Object.assign(ru, {
    "The assistant can offer to switch the language when you write in another language.":
      "Помощник предложит сменить язык, если вы начнёте писать на другом языке.",
    "Handheld keyboard": "Клавиатура ТСД",
    "Device key {value}": "Клавиша {value}",
    "Sample carton": "Пример короба",
    "Sample carton illustration": "Изображение короба",
  });
  Object.assign(ru, {
    "The next Scan deliberately tests an incorrect barcode.":
      "Следующее сканирование специально проверит неверный штрихкод.",
  });
  const catalogs =
    typeof module === "object" && module.exports
      ? require("./onboarding-translations.js")
      : typeof window === "object"
        ? window.QuarkOnboardingCatalogs
        : {};
  function format(key, values, language) {
    const dict = language === "ru" ? ru : catalogs[language];
    return (dict?.[key] || key).replace(/\{(\w+)\}/g, (_, name) =>
      String(values[name] ?? "{" + name + "}"),
    );
  }
  function localized(text, language) {
    if (language === "en") return text;
    if (language === "ru") return tr(text, language);
    const dict = catalogs[language];
    if (!dict) return text;
    const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/),
      lead = match[1],
      tail = match[3],
      value = match[2];
    if (!value) return text;
    const lookup = (key) =>
      dict[key] ||
      dict[
        Object.keys(dict).find((k) => k.toLowerCase() === key.toLowerCase())
      ];
    if (lookup(value)) return lead + lookup(value) + tail;
    if (value.includes("\n"))
      return text
        .split("\n")
        .map((t) => localized(t, language))
        .join("\n");
    const marked = value.match(/^([✓○→]\s*)(.*)$/);
    if (marked) return lead + marked[1] + localized(marked[2], language) + tail;
    let m = value.match(
      /^(Receiving|Putaway|Picking) ((?:RECV|PUT|SO)-[A-Za-z0-9-]+)$/,
    );
    if (m) return lead + localized(m[1], language) + " " + m[2] + tail;
    const templates = [
      [/^Device key (.+)$/, "Device key {value}", ["value"]],
      [/^(\d+) events$/, "{count} events", ["count"]],
      [
        /^Configuration · (\d)\/3 sample processes$/i,
        "Configuration · {count}/3 sample processes",
        ["count"],
      ],
      [
        /^(Receiving|Putaway|Picking) simulation started$/,
        "{process} simulation started",
        ["process"],
      ],
      [
        /^(Receiving|Putaway|Picking) sample passed$/,
        "{process} sample passed",
        ["process"],
      ],
      [
        /^Try the (receiving|putaway|picking) task$/,
        "Try the {process} task",
        ["process"],
      ],
      [
        /^Wrong product\. Expected (.+)\.$/,
        "Wrong product. Expected {value}.",
        ["value"],
      ],
      [
        /^Wrong source location\. Expected (.+)\.$/,
        "Wrong source location. Expected {value}.",
        ["value"],
      ],
      [
        /^Wrong pallet\. Expected (.+)\.$/,
        "Wrong pallet. Expected {value}.",
        ["value"],
      ],
      [
        /^Quantity mismatch\. Expected (\d+) EA\.$/,
        "Quantity mismatch. Expected {count} EA.",
        ["count"],
      ],
      [/^Expected: (.+)$/, "Expected: {value}", ["value"]],
      [/^(\d+) \/ 48 units scanned$/, "{count} / 48 units scanned", ["count"]],
      [/^(\d+) EA$/, "{count} EA", ["count"]],
      [/^line (\d+)\/(\d+)$/, "line {current}/{total}", ["current", "total"]],
    ];
    for (const [pattern, key, params] of templates) {
      m = value.match(pattern);
      if (m)
        return (
          lead +
          format(
            key,
            Object.fromEntries(
              params.map((name, i) => [
                name,
                name === "process" ? localized(m[i + 1], language) : m[i + 1],
              ]),
            ),
            language,
          ) +
          tail
        );
    }
    m = value.match(/^([A-Za-z ]+): (.+)$/);
    if (m && lookup(m[1]))
      return lead + lookup(m[1]) + ": " + localized(m[2], language) + tail;
    if (value.includes(" → "))
      return (
        lead +
        value
          .split(" → ")
          .map((t) => localized(t, language))
          .join(" → ") +
        tail
      );
    if (value.includes(" · "))
      return (
        lead +
        value
          .split(" · ")
          .map((t) => localized(t, language))
          .join(" · ") +
        tail
      );
    m = value.match(
      /^(large|simple|image|sound|codes|reasons|quantity|language): (true|false|en|ru|el|bg|sr|ro|sq)$/,
    );
    if (m) {
      const labels = {
        large: "Larger text",
        simple: "Hide extra fields",
        image: "Show sample product illustration",
        sound: "Play an error sound",
        codes: "Enable short action codes",
        reasons: "Show why a scan is blocked",
        quantity: "Confirm quantity before completion",
        language: "Handheld language",
      };
      return (
        lead +
        localized(labels[m[1]], language) +
        ": " +
        localized(
          m[2] === "true" ? "On" : m[2] === "false" ? "Off" : m[2],
          language,
        ) +
        tail
      );
    }
    let translated = value;
    for (const key of Object.keys(dict)
      .filter((k) => k.length > 3)
      .sort((a, b) => b.length - a.length))
      translated = translated.split(key).join(dict[key]);
    translated = translated
      .replace(/(\d+) EA/g, (_, count) =>
        format("{count} EA", { count }, language),
      )
      .replace(/line (\d+)\/(\d+)/g, (_, current, total) =>
        format("line {current}/{total}", { current, total }, language),
      );
    return lead + translated + tail;
  }
  const originalText = new WeakMap(),
    originalAttributes = new WeakMap();
  function apply(root, language) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (
        node.parentElement?.closest(
          "script,style,textarea,.message-row.user:not([data-guided-answer]),[data-ai-message]",
        )
      )
        continue;
      if (!originalText.has(node)) originalText.set(node, node.textContent);
      node.textContent = localized(originalText.get(node), language);
    }
    for (const element of root.querySelectorAll(
      "[aria-label],[placeholder],[title]",
    )) {
      if (!originalAttributes.has(element))
        originalAttributes.set(element, new Map());
      const map = originalAttributes.get(element);
      for (const attribute of ["aria-label", "placeholder", "title"]) {
        if (!element.hasAttribute(attribute)) continue;
        if (!map.has(attribute))
          map.set(attribute, element.getAttribute(attribute));
        element.setAttribute(
          attribute,
          localized(map.get(attribute), language),
        );
      }
    }
    document.documentElement.lang = language;
    document.title =
      "Quark WMS · " + localized("AI onboarding · guided demo", language);
  }
  return { tr: localized, apply, format, catalog: () => Object.keys(ru) };
});
