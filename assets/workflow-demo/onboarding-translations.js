/* Static demo translations. No provider requests are made to change the UI language. */
(function (root) {
  const catalogs = {
    bg: {
      "AI onboarding · guided demo": "AI въвеждане · насочена демонстрация",
      "Local RF simulation": "Локална RF симулация",
      "Setup assistant": "Асистент за настройка",
      "Configure · simulate · improve":
        "Конфигурирайте · симулирайте · подобрявайте",
      Activity: "Активност",
      Live: "На живо",
      LIVE: "НА ЖИВО",
      Chat: "Чат",
      RF: "RF",
      "Message to setup assistant": "Съобщение до асистента за настройка",
      "Send message": "Изпрати съобщение",
      "Attach warehouse plan": "Прикачи план на склада",
      "Remove plan": "Премахни плана",
      "Toggle theme": "Смени темата",
      "Reset demo": "Нулирай демото",
      "Collapse chat": "Свий чата",
      "Show activity": "Покажи активността",
      "Continue setup chat": "Продължи чата за настройка",
      "Answer or ask Quark AI…": "Отговорете или попитайте Quark AI…",
      Privacy: "Поверителност",
      "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
        "Към Quark AI се изпращат само съобщенията, които изпращате, и избраните файлове. Насочените избори и RF действията остават на тази страница.",
      "What do you store?": "Какво съхранявате?",
      "Ordinary goods": "Обикновени стоки",
      "Goods with expiry dates": "Стоки със срок на годност",
      "Serial-controlled goods": "Стоки с контрол по серийни номера",
      "How are goods handled?": "Как се обработват стоките?",
      "Pallets, cases and units": "Палети, кашони и единици",
      "Cases and units": "Кашони и единици",
      "Do operators scan product barcodes during receiving?":
        "Сканират ли операторите баркода на продукта при приемане?",
      "Yes, product scan is required": "Да, сканирането на продукта е задължително",
      "Not consistently yet": "Още не последователно",
      "How is quantity confirmed?": "Как се потвърждава количеството?",
      "Enter the quantity": "Въведете количеството",
      "Scan each unit": "Сканирайте всяка единица",
      "Who chooses the putaway location?": "Кой избира мястото за складиране?",
      "The WMS suggests a location": "WMS предлага място",
      "The operator chooses": "Операторът избира",
      "How do operators pick orders?":
        "Как операторите комплектоват поръчките?",
      "One order at a time": "По една поръчка наведнъж",
      "In waves": "На вълни",
      "Do you check the product before packing is completed?":
        "Проверявате ли продукта, преди опаковането да приключи?",
      "Yes, product check required": "Да, изисква се проверка на продукта",
      "Not currently": "Към момента не",
      "Use General Distribution sample":
        "Използвай примера General Distribution",
      "The sample includes one expiry-dated milk line. No serial capture.":
        "Примерът включва един ред с мляко със срок на годност. Без записване на серийни номера.",
      "Confirmed warehouse facts": "Потвърдени факти за склада",
      "Prepare mobile processes →": "Подготви мобилните процеси →",
      "Warehouse model confirmed": "Моделът на склада е потвърден",
      "Operator permissions configured":
        "Правата на операторите са конфигурирани",
      "Receiving example prepared": "Примерът за приемане е подготвен",
      "Putaway example prepared": "Примерът за складиране е подготвен",
      "Picking example prepared": "Примерът за комплектуване е подготвен",
      "→ Preparing the virtual handheld": "→ Подготовка на виртуалния терминал",
      Before: "Преди",
      After: "След",
      "Unknown product barcode": "Непознат баркод на продукт",
      "No recovery rule": "Няма правило за възстановяване",
      "Block and offer retry": "Блокиране и предлагане на нов опит",
      "Target location scan": "Сканиране на целевото място",
      "Optional in test variant": "По избор в тестовия вариант",
      Required: "Задължително",
      "Product check before pick completion":
        "Проверка на продукта преди приключване на комплектоването",
      "Apply correction & retry →": "Приложи корекцията и опитай отново →",
      "Apply correction & retry": "Приложи корекцията и опитай отново",
      "Test putaway →": "Тествай складирането →",
      "Test picking →": "Тествай комплектоването →",
      "Customize the handheld →": "Персонализирай терминала →",
      "Make the handheld fit your team": "Нагодете терминала към вашия екип",
      "Larger text": "По-голям текст",
      "Hide extra fields": "Скрий допълнителните полета",
      "Show sample product illustration":
        "Покажи примерна илюстрация на продукта",
      "Play an error sound": "Пускай звук при грешка",
      "Enable short action codes": "Включи кратки кодове за действия",
      "Show why a scan is blocked": "Покажи защо сканирането е блокирано",
      "Confirm quantity before completion":
        "Потвърждавай количеството преди приключване",
      "Handheld language": "Език на терминала",
      "Action controls and menu headings switch language; sample product identifiers stay unchanged.":
        "Бутоните за действия и заглавията на менюто сменят езика; идентификаторите на примерните продукти остават непроменени.",
      "Check operator permissions →": "Провери правата на операторите →",
      "Warehouse Operator": "Складов оператор",
      "Excluded from the operator role:": "Изключено от ролята на оператор:",
      Administration: "Администриране",
      "Policy changes": "Промени в политики",
      "User management": "Управление на потребители",
      "Financial data": "Финансови данни",
      "Unassigned operations": "Неназначени операции",
      "This checks the simulated menu, not access to a live system.":
        "Това проверява симулираното меню, а не достъп до работеща система.",
      "Review onboarding result →": "Прегледай резултата от въвеждането →",
      "Warehouse mobile configuration ready":
        "Мобилната конфигурация на склада е готова",
      "Guided demo results · sample warehouse only":
        "Резултати от насочената демонстрация · само примерен склад",
      "Receiving — Validated in demo": "Приемане — валидирано в демото",
      "Putaway — Validated in demo": "Складиране — валидирано в демото",
      "Picking — Validated in demo": "Комплектоване — валидирано в демото",
      "Barcode controls — Enabled": "Контрол на баркодове — включен",
      "Location verification — Required":
        "Проверка на местоположение — задължителна",
      "Operator permissions — Verified in demo":
        "Права на операторите — проверени в демото",
      "TSD layout — Customized": "Разположение на TSD — персонализирано",
      "Business scenarios — 3/3 passed": "Бизнес сценарии — 3/3 успешни",
      "Discuss my setup · leave work email →":
        "Обсъдете моята настройка · оставете служебен имейл →",
      "Review configuration": "Прегледай конфигурацията",
      "Replay simulation": "Повтори симулацията",
      "Approve onboarding result": "Одобри резултата от въвеждането",
      "Demo result acknowledged. No activation was performed.":
        "Резултатът от демото е приет. Не е извършена активация.",
      Receiving: "Приемане",
      Putaway: "Складиране",
      Picking: "Комплектоване",
      "Receiving · Putaway · Picking": "Приемане · Складиране · Комплектоване",
      "Receiving, Putaway, Picking": "Приемане, Складиране, Комплектоване",
      "✓ Receiving · Putaway · Picking":
        "✓ Приемане · Складиране · Комплектоване",
      "Your mobile processes": "Вашите мобилни процеси",
      "Confirm warehouse facts in chat to prepare the sample.":
        "Потвърдете фактите за склада в чата, за да подготвим примера.",
      "Confirm warehouse facts in chat.":
        "Потвърдете фактите за склада в чата.",
      "Waiting for warehouse facts": "Очакване на факти за склада",
      "Preparing the sample configuration":
        "Подготовка на примерната конфигурация",
      "Discover warehouse": "Опознаване на склада",
      "Prepare mobile processes": "Подготви мобилните процеси",
      "Customize the handheld": "Персонализирай терминала",
      "Check operator access": "Провери достъпа на оператора",
      "Demo checks complete": "Проверките на демото приключиха",
      "Demo result acknowledged": "Резултатът от демото е приет",
      "Review sample result": "Прегледай примерния резултат",
      Pallet: "Палет",
      Product: "Продукт",
      Expected: "Очаквано",
      Contents: "Съдържание",
      "Suggested bin": "Предложено място",
      Order: "Поръчка",
      Source: "Източник",
      Quantity: "Количество",
      "Quantity (EA)": "Количество (EA)",
      "Expiry date": "Срок на годност",
      "Scan pallet": "Сканирай палет",
      "Scan product": "Сканирай продукт",
      "Confirm expected quantity": "Потвърди очакваното количество",
      "Enter expiry date": "Въведи срок на годност",
      "Complete receipt": "Приключи приемането",
      "Scan suggested location": "Сканирай предложеното място",
      "Confirm putaway": "Потвърди складирането",
      "Scan source location": "Сканирай изходното място",
      "Confirm pick quantity": "Потвърди количеството за комплектоване",
      "Confirm pick line": "Потвърди реда за комплектоване",
      "Review the accepted scans and complete this step.":
        "Прегледайте приетите сканирания и приключете тази стъпка.",
      "Sample zone match · free capacity. Target scan verifies the suggested bin.":
        "Съвпадение на зона в примера · свободен капацитет. Целевото сканиране проверява предложеното място.",
      "Controlled error test": "Контролиран тест за грешка",
      "Try a wrong barcode before accepting the correct scan.":
        "Опитайте грешен баркод, преди да приемете правилното сканиране.",
      "Try a wrong bin before accepting the correct scan.":
        "Опитайте грешно място, преди да приемете правилното сканиране.",
      "Scan UNKNOWN-999": "Сканирай UNKNOWN-999",
      "Scan A-02-04": "Сканирай A-02-04",
      Scan: "Сканирай",
      Confirm: "Потвърди",
      "Unknown product barcode. Please retry.":
        "Непознат баркод на продукт. Моля, опитайте отново.",
      "Wrong location. Expected A-01-02.": "Грешно място. Очаква се A-01-02.",
      "Enter a valid future expiry date.":
        "Въведете валидна бъдеща дата на срок на годност.",
      "Task complete": "Задачата е завършена",
      "Sample checks passed": "Примерните проверки са успешни",
      "No live warehouse changes": "Без промени в работещ склад",
      "Review the configuration change in chat":
        "Прегледайте промяната в конфигурацията в чата",
      "Live layout preview": "Преглед на разположението на живо",
      "Handheld layout preview": "Преглед на разположението на терминала",
      "Preview only · no stock change":
        "Само преглед · без промяна на наличности",
      "Test error feedback": "Тествай съобщението за грешка",
      "Operator menu": "Меню на оператора",
      "Assigned process": "Назначен процес",
      "Only assigned warehouse tasks.": "Само назначени складови задачи.",
      "No administration access.": "Без достъп до администриране.",
      "Simulated role · 3 processes": "Симулирана роля · 3 процеса",
      Handheld: "Терминал",
      Forklift: "Мотокар",
      "GUIDED SIMULATION": "НАСОЧЕНА СИМУЛАЦИЯ",
      "QUARK / GUIDED SIMULATION": "QUARK / НАСОЧЕНА СИМУЛАЦИЯ",
      "SAMPLE CHECKS PASSED": "ПРИМЕРНИТЕ ПРОВЕРКИ СА УСПЕШНИ",
      "WAREHOUSE OPERATOR": "СКЛАДОВ ОПЕРАТОР",
      "Continue on the handheld": "Продължете на терминала",
      "Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.":
        "Използвайте бутоните на терминала, за да опитате действието сами. Приетите от вас действия се показват в Активност.",
      Role: "Роля",
      Processes: "Процеси",
      "Target scan": "Целево сканиране",
      "Product check": "Проверка на продукта",
      Activation: "Активация",
      "Separate administrator step": "Отделна стъпка за администратор",
      "Quark AI is replying…": "Quark AI отговаря…",
      Stop: "Спри",
      "Retry AI": "Опитай отново с AI",
      "Earlier AI reply. Ask again in this language.":
        "По-ранен отговор на AI. Попитайте отново на този език.",
      "Continue with your warehouse setup":
        "Продължете с настройката на склада",
      "Send this example to the Quark team. We will follow up about your warehouse.":
        "Изпратете този пример до екипа на Quark. Ще се свържем с вас относно вашия склад.",
      "Work email": "Служебен имейл",
      Company: "Компания",
      "Send my contact details and this demo setup to Quark for follow-up.":
        "Изпратете моите контактни данни и тази демо настройка на Quark за последващ контакт.",
      "Privacy policy": "Политика за поверителност",
      "Send my setup to Quark →": "Изпрати моята настройка до Quark →",
      Close: "Затвори",
      "Review sample configuration": "Прегледай примерната конфигурация",
      "Configured controls": "Конфигурирани контроли",
      "No production activation or live permissions test.":
        "Без активация в продуктивна среда и без тест на правата на живо.",
      "Guided demo started": "Насоченото демо стартира",
      "Sample data · no live warehouse connection":
        "Примерни данни · без връзка с работещ склад",
      "Sample warehouse selected": "Избран е примерен склад",
      "Includes an expiry-dated milk line. No serial numbers.":
        "Включва ред с мляко със срок на годност. Без серийни номера.",
      "Warehouse fact confirmed": "Факт за склада е потвърден",
      "Configuration started": "Конфигурирането започна",
      "Existing process templates; no new business logic generated":
        "Съществуващи шаблони на процеси; не е генерирана нова бизнес логика",
      "Use Scan, Confirm and Retry yourself":
        "Използвайте сами Сканирай, Потвърди и Опитай отново",
      "Scan blocked": "Сканирането е блокирано",
      "Configuration correction proposed":
        "Предложена е корекция на конфигурацията",
      "Correction applied": "Корекцията е приложена",
      "Operator action accepted": "Действието на оператора е прието",
      "48 EA received": "Приети са 48 EA",
      "48 EA stored at A-01-02": "48 EA са складирани на A-01-02",
      "2 lines · 18 EA · sent to Packing":
        "2 реда · 18 EA · изпратени към опаковане",
      "First order line completed": "Първият ред от поръчката е завършен",
      "12 EA picked": "Комплектовани са 12 EA",
      "Handheld layout customized":
        "Разположението на терминала е персонализирано",
      "Operator permissions checked": "Правата на операторите са проверени",
      "Only three assigned processes visible":
        "Видими са само три назначени процеса",
      "No activation or production write":
        "Без активация или запис в продукция",
      "Handheld preference changed": "Предпочитанието за терминала е променено",
      "Error feedback preview": "Преглед на съобщението за грешка",
      "Visible feedback always shown; audio only when enabled":
        "Визуалното съобщение се показва винаги; звукът — само когато е включен",
      "AI reply received": "Получен е отговор от AI",
      "Explanation and confirmed facts only; no warehouse actions":
        "Само обяснение и потвърдени факти; без действия в склада",
      "AI reply unavailable": "Отговорът от AI не е наличен",
      "The controlled simulation remains available":
        "Контролираната симулация остава налична",
      "Configuration updated": "Конфигурацията е обновена",
      "Retry the expected barcode": "Опитайте отново с очаквания баркод",
      "48 EA · 2 cases × 24": "48 EA · 2 кашона × 24",
      "12 EA": "12 EA",
      "6 EA": "6 EA",
      "one unit": "една единица",
      SCANNER: "СКАНЕР",
      "Demo sections": "Раздели на демото",
      "Activity and events": "Активност и събития",
      "Configuration details": "Подробности за конфигурацията",
      "Waiting for setup": "Очакване на настройка",
      "Configuration · waiting for facts": "Конфигурация · очакване на факти",
      "SCANNED DESTINATION": "СКАНИРАНА ДЕСТИНАЦИЯ",
      "Quantity confirmation": "Потвърждение на количеството",
      Optional: "По избор",
      "Action codes": "Кодове за действия",
      "1 Scan · 2 Confirm": "1 Сканирай · 2 Потвърди",
      "FORKLIFT TERMINAL · SIMULATION": "ТЕРМИНАЛ ЗА МОТОКАР · СИМУЛАЦИЯ",
      "[SCANNER]": "[СКАНЕР]",
      English: "English",
      "Handheld preferences": "Предпочитания за терминала",
      On: "Вкл.",
      Off: "Изкл.",
      "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.":
        "Ще ви помогна да настроите мобилните процеси на вашия склад. Първо ще ви попитам за работата ви, след което ще тестваме приемането, складирането и комплектоването на виртуален терминал. Използвайте примерния склад или отговаряйте на по един въпрос наведнъж.",
      "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.":
        "Използвайте General Distribution: обикновени стоки плюс един ред с мляко със срок на годност, палети/кашони/единици, сканиране на продукти и места, насочено складиране, комплектоване по една поръчка и проверки при опаковане.",
      "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.":
        "Това са потвърдени факти. Ще конфигурирам съществуващи мобилни процеси и ще ги тествам с примерни наличности. Не е свързан работещ склад.",
      "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.":
        "Работите на вълни. Това кратко демо тества една поръчка в процеса на комплектоване; то не валидира вашия процес за пускане на вълни.",
      "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.":
        "Избрахте стоки с контрол по серийни номера. Този насочен пример за дистрибуция използва ред без серийни номера и не валидира записването им. Изискването ви за серийни номера остава в обобщението за последващ контакт.",
      "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.":
        "Нека тестваме приемането RECV-10042. Сканирайте палет PLT-000184, след това продукта. Умишлено ще опитаме един непознат баркод, за да проверим възстановяването.",
      "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.":
        "Непознатият баркод беше отхвърлен. Конфигурирах ясна грешка и опция за нов опит, така че операторът да може да се възстанови, без да се създава непознат продукт.",
      "Correction applied to this demo configuration. Retry the scan with the expected barcode.":
        "Корекцията е приложена към тази демо конфигурация. Опитайте отново сканирането с очаквания баркод.",
      "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.":
        "Записването на срок на годност е включено, защото потвърдихте стоки със срок на годност. Датата остава към тази примерна наличност.",
      "Receipt complete. The unknown barcode test now has a clear block-and-retry rule.":
        "Приемането приключи. Тестът с непознат баркод вече има ясно правило за блокиране и нов опит.",
      "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.":
        "Сега поставете получения палет. Примерната WMS предлага A-01-02 след симулирана проверка на зона за съхранение и капацитет. FEFO се отнася до избора на наличности по срок на годност, а не гарантира, че това място е подходящо.",
      "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.":
        "Умишлено непълният тестов вариант позволяваше незадължителна проверка на целевото място. Симулацията улови несъответствието. Направих целевото сканиране задължително и блокирах замяната на предложеното място.",
      "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution.":
        "Складирането приключи. Целият LPN беше преместен с неговите 48 единици. Задължителното целево сканиране предотврати замяна на място.",
      "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.":
        "Нека комплектоваме примерна поръчка SO-10428 по маршрут A-01-02 → B-03-01. Ще тестваме грешен SKU, преди да комплектоваме правилния продукт.",
      "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.":
        "Грешният SKU беше отхвърлен. Сега проверката на продукта е задължителна преди приключване на комплектоване. Това е конфигуриран контрол, а не измерено твърдение за производителност.",
      "First line verified. Continue to B-03-01 for 6 EA of WATER-500.":
        "Първият ред е проверен. Продължете към B-03-01 за 6 EA от WATER-500.",
      "Picking complete. Both lines were checked and the sample order is now waiting for Packing.":
        "Комплектоването приключи. И двата реда бяха проверени и примерната поръчка сега чака опаковане.",
      "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.":
        "И трите примерни процеса бяха успешни. Нагодете терминала за по-лесна употреба: опитайте по-голям текст, илюстрация на продукт или звук при грешка. Промените се виждат веднага.",
      "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.":
        "Сега проверете менюто на оператора. То съдържа само Приемане, Складиране и Комплектоване. Администрирането, политиките, потребителите и финансовите данни са изключени от тази симулирана роля.",
      "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.":
        "Конфигурацията премина три примерни бизнес сценария. Нито един склад не е активиран. Администратор би прегледал този резултат преди отделна стъпка за активация. Оставете служебен имейл, ако искате да обсъдите настройката с Quark.",
      "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.":
        "Резултатът от демото е приет. Нищо не е внедрено. Можете да оставите имейл, за да прегледате следващите стъпки с екипа на Quark.",
      "Replaying the same confirmed sample warehouse. No new answers are needed.":
        "Повтаряме същия потвърден примерен склад. Не са нужни нови отговори.",
      "First run the controlled error test, then apply the correction and retry.":
        "Първо изпълнете контролирания тест за грешка, след това приложете корекцията и опитайте отново.",
      "Run the highlighted error test before finishing this demo process.":
        "Изпълнете маркирания тест за грешка, преди да приключите този демо процес.",
      "Scan accepted": "Сканирането е прието",
      Confirmed: "Потвърдено",
      "Awaiting scan": "Очаква сканиране",
      "Scanned destination": "Сканирана дестинация",
      "Demo language": "Език на демото",
      "Sending…": "Изпраща се…",
      Sent: "Изпратено",
      "Your setup was accepted. Thank you — the Quark team will follow up.":
        "Настройката ви беше приета. Благодарим — екипът на Quark ще се свърже с вас.",
      "The request timed out. Please check before resending.":
        "Заявката изтече. Моля, проверете, преди да изпратите отново.",
      "AI took too long. Your message is kept; retry or use the guided choices.":
        "AI отне твърде дълго. Съобщението ви е запазено; опитайте отново или използвайте насочените избори.",
      "Could not send this setup. Please retry or email hello@quark.build.":
        "Настройката не можа да бъде изпратена. Моля, опитайте отново или пишете на hello@quark.build.",
      Configuration: "Конфигурация",
      "Sample product illustration": "Примерна илюстрация на продукт",
      "Terminal session": "Сесия на терминала",
      "Terminal view": "Изглед на терминала",
      "Warehouse terminal preview": "Преглед на складов терминал",
      "Choose a JPEG, PNG or PDF up to 3 MB.":
        "Изберете JPEG, PNG или PDF до 3 MB.",
      "Could not read the file.": "Файлът не можа да бъде прочетен.",
      "AI is unavailable. Use the guided choices to continue.":
        "AI не е наличен. Използвайте насочените избори, за да продължите.",
      "AI returned an unexpected response. The guided sample is still available.":
        "AI върна неочакван отговор. Насоченият пример все още е наличен.",
      "{count} events": "{count} събития",
      "Configuration · {count}/3 sample processes":
        "Конфигурация · {count}/3 примерни процеса",
      "{process} simulation started": "Симулацията на {process} стартира",
      "{process} sample passed": "Примерът за {process} е успешен",
      "Try the {process} task": "Опитайте задачата {process}",
      "Wrong product. Expected {value}.": "Грешен продукт. Очаква се {value}.",
      "Wrong source location. Expected {value}.":
        "Грешно изходно място. Очаква се {value}.",
      "Wrong pallet. Expected {value}.": "Грешен палет. Очаква се {value}.",
      "Quantity mismatch. Expected {count} EA.":
        "Несъответствие в количеството. Очаква се {count} EA.",
      "Expected: {value}": "Очаква се: {value}",
      "{count} / 48 units scanned": "Сканирани единици: {count} / 48",
      "{count} EA": "{count} EA",
      "line {current}/{total}": "ред {current}/{total}",
      "{count} Case × {units}": "{count} кашон × {units}",
      "Sent only with your next AI message":
        "Изпраща се само с следващото ви съобщение до AI",
      "{setting}: On": "{setting}: Вкл.",
      "{setting}: Off": "{setting}: Изкл.",
      "Switch the demo to {language}?": "Да сменя ли демото на {language}?",
      "Switch language": "Смяна на езика",
      "Keep current language": "Запази текущия език",
      "Language switched. Your progress is preserved.":
        "Езикът е сменен. Напредъкът ви е запазен.",
      receiving: "приемане",
      putaway: "складиране",
      picking: "комплектоване",
      "Scan or type": "Сканирайте или въведете",
      Loading: "Зареждане",
      Received: "Приет",
      Blocked: "Блокиран",
      "For this guided sample, I will use the milk example. Your product remains part of the discussion.":
        "За този насочен пример ще използвам примера с мляко. Вашият продукт остава част от обсъждането.",
      "The assistant can offer to switch the language when you write in another language.":
        "Асистентът може да предложи смяна на езика, когато пишете на друг език.",
      "Handheld keyboard": "Клавиатура на терминала",
      "Device key {value}": "Клавиш {value}",
      "Sample carton": "Примерен кашон",
      "Sample carton illustration": "Илюстрация на примерен кашон",
    },
    ro: {
      "AI onboarding · guided demo": "Onboarding AI · demo guidat",
      "Local RF simulation": "Simulare RF locală",
      "Setup assistant": "Asistent de configurare",
      "Configure · simulate · improve":
        "Configurează · simulează · îmbunătățește",
      Activity: "Activitate",
      Live: "Live",
      LIVE: "LIVE",
      Chat: "Chat",
      RF: "RF",
      "Message to setup assistant": "Mesaj către asistentul de configurare",
      "Send message": "Trimite mesajul",
      "Attach warehouse plan": "Atașează planul depozitului",
      "Remove plan": "Elimină planul",
      "Toggle theme": "Schimbă tema",
      "Reset demo": "Resetează demo-ul",
      "Collapse chat": "Restrânge chatul",
      "Show activity": "Afișează activitatea",
      "Continue setup chat": "Continuă conversația de configurare",
      "Answer or ask Quark AI…": "Răspunde sau întreabă Quark AI…",
      Privacy: "Confidențialitate",
      "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
        "Doar mesajele pe care le trimiți și fișierele selectate ajung la Quark AI. Alegerile ghidate și acțiunile RF rămân în această pagină.",
      "What do you store?": "Ce stocați?",
      "Ordinary goods": "Mărfuri obișnuite",
      "Goods with expiry dates": "Mărfuri cu date de expirare",
      "Serial-controlled goods": "Mărfuri controlate prin serie",
      "How are goods handled?": "Cum sunt manipulate mărfurile?",
      "Pallets, cases and units": "Paleți, cutii și unități",
      "Cases and units": "Cutii și unități",
      "Do operators scan product barcodes during receiving?":
        "Scanează operatorii codul de bare al produsului la recepție?",
      "Yes, product scan is required": "Da, scanarea produsului este obligatorie",
      "Not consistently yet": "Nu constant încă",
      "How is quantity confirmed?": "Cum se confirmă cantitatea?",
      "Enter the quantity": "Introduceți cantitatea",
      "Scan each unit": "Scanați fiecare unitate",
      "Who chooses the putaway location?": "Cine alege locația de depozitare?",
      "The WMS suggests a location": "WMS sugerează o locație",
      "The operator chooses": "Operatorul alege",
      "How do operators pick orders?": "Cum preiau operatorii comenzile?",
      "One order at a time": "Câte o comandă pe rând",
      "In waves": "În valuri",
      "Do you check the product before packing is completed?":
        "Verificați produsul înainte de finalizarea ambalării?",
      "Yes, product check required":
        "Da, verificarea produsului este obligatorie",
      "Not currently": "Momentan nu",
      "Use General Distribution sample":
        "Folosește exemplul de distribuție generală",
      "The sample includes one expiry-dated milk line. No serial capture.":
        "Exemplul include o linie de lapte cu dată de expirare. Fără captură de serii.",
      "Confirmed warehouse facts": "Fapte confirmate despre depozit",
      "Prepare mobile processes →": "Pregătește procesele mobile →",
      "Warehouse model confirmed": "Modelul depozitului confirmat",
      "Operator permissions configured":
        "Permisiunile operatorilor configurate",
      "Receiving example prepared": "Exemplu de recepție pregătit",
      "Putaway example prepared": "Exemplu de depozitare pregătit",
      "Picking example prepared": "Exemplu de preluare pregătit",
      "→ Preparing the virtual handheld":
        "→ Se pregătește terminalul portabil virtual",
      Before: "Înainte",
      After: "După",
      "Unknown product barcode": "Cod de bare de produs necunoscut",
      "No recovery rule": "Fără regulă de recuperare",
      "Block and offer retry": "Blochează și oferă reincercarea",
      "Target location scan": "Scanarea locației țintă",
      "Optional in test variant": "Opțional în varianta de test",
      Required: "Obligatoriu",
      "Product check before pick completion":
        "Verificarea produsului înainte de finalizarea preluării",
      "Apply correction & retry →": "Aplică corecția și reîncearcă →",
      "Apply correction & retry": "Aplică corecția și reîncearcă",
      "Test putaway →": "Testează depozitarea →",
      "Test picking →": "Testează preluarea →",
      "Customize the handheld →": "Personalizează terminalul portabil →",
      "Make the handheld fit your team":
        "Adaptează terminalul portabil echipei tale",
      "Larger text": "Text mai mare",
      "Hide extra fields": "Ascunde câmpurile suplimentare",
      "Show sample product illustration":
        "Afișează ilustrația exemplu a produsului",
      "Play an error sound": "Redă un sunet la eroare",
      "Enable short action codes": "Activează codurile scurte de acțiune",
      "Show why a scan is blocked": "Afișează motivul blocării unei scanări",
      "Confirm quantity before completion":
        "Confirmă cantitatea înainte de finalizare",
      "Handheld language": "Limba terminalului portabil",
      "Action controls and menu headings switch language; sample product identifiers stay unchanged.":
        "Comenzile de acțiune și titlurile meniului își schimbă limba; identificatorii de produs exemplu rămân nemodificați.",
      "Check operator permissions →": "Verifică permisiunile operatorilor →",
      "Warehouse Operator": "Operator de depozit",
      "Excluded from the operator role:": "Exclus din rolul de operator:",
      Administration: "Administrare",
      "Policy changes": "Modificări ale politicii",
      "User management": "Gestionarea utilizatorilor",
      "Financial data": "Date financiare",
      "Unassigned operations": "Operațiuni neatribuite",
      "This checks the simulated menu, not access to a live system.":
        "Aceasta verifică meniul simulat, nu accesul la un sistem live.",
      "Review onboarding result →": "Revizuiește rezultatul integrării →",
      "Warehouse mobile configuration ready":
        "Configurația mobilă a depozitului este gata",
      "Guided demo results · sample warehouse only":
        "Rezultate din demonstrația ghidată · doar depozit exemplu",
      "Receiving — Validated in demo": "Recepție — Validat în demonstrație",
      "Putaway — Validated in demo": "Depozitare — Validat în demonstrație",
      "Picking — Validated in demo": "Culegere — Validat în demonstrație",
      "Barcode controls — Enabled": "Controale cu cod de bare — Activate",
      "Location verification — Required": "Verificarea locației — Obligatorie",
      "Operator permissions — Verified in demo":
        "Permisiunile operatorului — Verificate în demonstrație",
      "TSD layout — Customized": "Layout TSD — Personalizat",
      "Business scenarios — 3/3 passed": "Scenarii de business — 3/3 trecute",
      "Discuss my setup · leave work email →":
        "Discută configurația mea · lasă e-mailul de lucru →",
      "Review configuration": "Revizuiește configurația",
      "Replay simulation": "Redă simularea",
      "Approve onboarding result": "Aprobă rezultatul integrării",
      "Demo result acknowledged. No activation was performed.":
        "Rezultatul demonstrației a fost confirmat. Nu s-a efectuat nicio activare.",
      Receiving: "Recepție",
      Putaway: "Depozitare",
      Picking: "Culegere",
      "Receiving · Putaway · Picking": "Recepție · Depozitare · Culegere",
      "Receiving, Putaway, Picking": "Recepție, Depozitare, Culegere",
      "✓ Receiving · Putaway · Picking": "✓ Recepție · Depozitare · Culegere",
      "Your mobile processes": "Procesele tale mobile",
      "Confirm warehouse facts in chat to prepare the sample.":
        "Confirmă datele depozitului în chat pentru a pregăti exemplul.",
      "Confirm warehouse facts in chat.":
        "Confirmă datele depozitului în chat.",
      "Waiting for warehouse facts": "Se așteaptă datele depozitului",
      "Preparing the sample configuration":
        "Se pregătește configurația exemplu",
      "Discover warehouse": "Descoperă depozitul",
      "Prepare mobile processes": "Pregătește procesele mobile",
      "Customize the handheld": "Personalizează terminalul portabil",
      "Check operator access": "Verifică accesul operatorului",
      "Demo checks complete": "Verificările demonstrației sunt complete",
      "Demo result acknowledged": "Rezultatul demonstrației a fost confirmat",
      "Review sample result": "Revizuiește rezultatul exemplu",
      Pallet: "Paletă",
      Product: "Produs",
      Expected: "Așteptat",
      Contents: "Conținut",
      "Suggested bin": "Locație sugerată",
      Order: "Comandă",
      Source: "Sursă",
      Quantity: "Cantitate",
      "Quantity (EA)": "Cantitate (EA)",
      "Expiry date": "Data expirării",
      "Scan pallet": "Scanează paleta",
      "Scan product": "Scanează produsul",
      "Confirm expected quantity": "Confirmă cantitatea așteptată",
      "Enter expiry date": "Introdu data expirării",
      "Complete receipt": "Finalizează recepția",
      "Scan suggested location": "Scanează locația sugerată",
      "Confirm putaway": "Confirmă depozitarea",
      "Scan source location": "Scanează locația sursă",
      "Confirm pick quantity": "Confirmă cantitatea culeasă",
      "Confirm pick line": "Confirmă linia de culegere",
      "Review the accepted scans and complete this step.":
        "Verifică scanările acceptate și finalizează acest pas.",
      "Sample zone match · free capacity. Target scan verifies the suggested bin.":
        "Potrivire cu zona exemplu · capacitate liberă. Scanarea țintei verifică locația sugerată.",
      "Controlled error test": "Test de eroare controlată",
      "Try a wrong barcode before accepting the correct scan.":
        "Încearcă un cod de bare greșit înainte de a accepta scanarea corectă.",
      "Try a wrong bin before accepting the correct scan.":
        "Încearcă o locație greșită înainte de a accepta scanarea corectă.",
      "Scan UNKNOWN-999": "Scanează UNKNOWN-999",
      "Scan A-02-04": "Scanează A-02-04",
      Scan: "Scanează",
      Confirm: "Confirmă",
      "Unknown product barcode. Please retry.":
        "Cod de bare de produs necunoscut. Te rugăm să încerci din nou.",
      "Wrong location. Expected A-01-02.":
        "Locație greșită. Se aștepta A-01-02.",
      "Enter a valid future expiry date.":
        "Introdu o dată de expirare validă, în viitor.",
      "Task complete": "Sarcină finalizată",
      "Sample checks passed": "Verificările exemplu au trecut",
      "No live warehouse changes": "Nicio modificare live a depozitului",
      "Review the configuration change in chat":
        "Revizuiește modificarea configurației în chat",
      "Live layout preview": "Previzualizare layout live",
      "Handheld layout preview": "Previzualizare layout terminal portabil",
      "Preview only · no stock change":
        "Doar previzualizare · fără modificare a stocului",
      "Test error feedback": "Testează feedbackul de eroare",
      "Operator menu": "Meniu operator",
      "Assigned process": "Proces atribuit",
      "Only assigned warehouse tasks.": "Doar sarcini de depozit atribuite.",
      "No administration access.": "Fără acces la administrare.",
      "Simulated role · 3 processes": "Rol simulat · 3 procese",
      Handheld: "Terminal portabil",
      Forklift: "Stivuitor",
      "GUIDED SIMULATION": "SIMULARE GHIDATĂ",
      "QUARK / GUIDED SIMULATION": "QUARK / SIMULARE GHIDATĂ",
      "SAMPLE CHECKS PASSED": "VERIFICĂRILE DE EXEMPLU AU TRECUT",
      "WAREHOUSE OPERATOR": "OPERATOR DEPOZIT",
      "Continue on the handheld": "Continuă pe terminalul portabil",
      "Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.":
        "Folosiți butoanele terminalului portabil pentru a încerca singur acțiunea. Acțiunile acceptate apar în Activitate.",
      Role: "Rol",
      Processes: "Procese",
      "Target scan": "Scanare destinație",
      "Product check": "Verificare produs",
      Activation: "Activare",
      "Separate administrator step": "Pas separat de administrator",
      "Quark AI is replying…": "Quark AI răspunde…",
      Stop: "Oprește",
      "Retry AI": "Reîncearcă AI",
      "Earlier AI reply. Ask again in this language.":
        "Răspuns AI anterior. Întrebați din nou în această limbă.",
      "Continue with your warehouse setup":
        "Continuați cu configurarea depozitului",
      "Send this example to the Quark team. We will follow up about your warehouse.":
        "Trimiteți acest exemplu echipei Quark. Vom reveni cu detalii despre depozitul dumneavoastră.",
      "Work email": "E-mail de serviciu",
      Company: "Companie",
      "Send my contact details and this demo setup to Quark for follow-up.":
        "Trimiteți datele mele de contact și această configurare demo către Quark pentru urmărire.",
      "Privacy policy": "Politica de confidențialitate",
      "Send my setup to Quark →": "Trimite configurația mea către Quark →",
      Close: "Închide",
      "Review sample configuration": "Verifică configurația de exemplu",
      "Configured controls": "Comenzi configurate",
      "No production activation or live permissions test.":
        "Nicio activare în producție și nicio testare a permisiunilor live.",
      "Guided demo started": "Simulare ghidată pornită",
      "Sample data · no live warehouse connection":
        "Date de exemplu · fără conexiune la un depozit real",
      "Sample warehouse selected": "Depozit de exemplu selectat",
      "Includes an expiry-dated milk line. No serial numbers.":
        "Include o linie de lapte cu dată de expirare. Fără numere de serie.",
      "Warehouse fact confirmed": "Fapt din depozit confirmat",
      "Configuration started": "Configurare pornită",
      "Existing process templates; no new business logic generated":
        "Șabloane de proces existente; nu se generează logică de business nouă",
      "Use Scan, Confirm and Retry yourself":
        "Folosiți singur Scanare, Confirmare și Reîncercare",
      "Scan blocked": "Scanare blocată",
      "Configuration correction proposed": "Corectură de configurare propusă",
      "Correction applied": "Corectură aplicată",
      "Operator action accepted": "Acțiune de operator acceptată",
      "48 EA received": "48 EA primite",
      "48 EA stored at A-01-02": "48 EA depozitate la A-01-02",
      "2 lines · 18 EA · sent to Packing":
        "2 linii · 18 EA · trimise la ambalare",
      "First order line completed": "Prima linie de comandă finalizată",
      "12 EA picked": "12 EA culese",
      "Handheld layout customized":
        "Layout-ul terminalului portabil a fost personalizat",
      "Operator permissions checked":
        "Permisiunile operatorului au fost verificate",
      "Only three assigned processes visible":
        "Sunt vizibile doar cele trei procese atribuite",
      "No activation or production write":
        "Nicio activare sau scriere în producție",
      "Handheld preference changed":
        "Preferința terminalului portabil a fost modificată",
      "Error feedback preview": "Previzualizare feedback de eroare",
      "Visible feedback always shown; audio only when enabled":
        "Feedbackul vizual este afișat întotdeauna; sunetul doar când este activat",
      "AI reply received": "Răspuns AI primit",
      "Explanation and confirmed facts only; no warehouse actions":
        "Doar explicații și fapte confirmate; fără acțiuni în depozit",
      "AI reply unavailable": "Răspuns AI indisponibil",
      "The controlled simulation remains available":
        "Simularea controlată rămâne disponibilă",
      "Configuration updated": "Configurare actualizată",
      "Retry the expected barcode": "Reîncercați codul de bare așteptat",
      "48 EA · 2 cases × 24": "48 EA · 2 cutii × 24",
      "12 EA": "12 EA",
      "6 EA": "6 EA",
      "one unit": "o unitate",
      SCANNER: "SCANER",
      "Demo sections": "Secțiuni demo",
      "Activity and events": "Activitate și evenimente",
      "Configuration details": "Detalii configurare",
      "Waiting for setup": "Se așteaptă configurarea",
      "Configuration · waiting for facts": "Configurare · se așteaptă fapte",
      "SCANNED DESTINATION": "DESTINAȚIE SCANATĂ",
      "Quantity confirmation": "Confirmare cantitate",
      Optional: "Opțional",
      "Action codes": "Coduri de acțiune",
      "1 Scan · 2 Confirm": "1 Scanare · 2 Confirmare",
      "FORKLIFT TERMINAL · SIMULATION": "TERMINAL STIVUITOR · SIMULARE",
      "[SCANNER]": "[SCANNER]",
      English: "Engleză",
      "Handheld preferences": "Preferințe pentru terminalul portabil",
      On: "Pornit",
      Off: "Oprit",
      "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.":
        "Vă voi ajuta să configurați procesele mobile ale depozitului dumneavoastră. Mai întâi vă voi întreba despre activitatea dumneavoastră, apoi vom testa recepția, depozitarea și culegerea pe un terminal portabil virtual. Folosiți depozitul de probă sau răspundeți câte o întrebare pe rând.",
      "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.":
        "Folosiți Distribuție generală: mărfuri obișnuite plus o linie de lapte cu dată de expirare, paleți/cutii/unități, scanare de produse și locații, depozitare dirijată, culegere pe comandă unică și verificări la ambalare.",
      "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.":
        "Acestea sunt informații confirmate. Voi configura procesele mobile existente, apoi le voi testa cu stoc de probă. Nu este conectat niciun depozit real.",
      "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.":
        "Lucrați cu valuri. Această demonstrație scurtă testează o singură comandă în fluxul de culegere; nu validează procesul dumneavoastră de lansare a valurilor.",
      "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.":
        "Ați selectat mărfuri controlate prin serie. Acest exemplu ghidat de distribuție folosește o linie fără serii și nu validează captura seriilor. Cerința dumneavoastră privind seriile rămâne în rezumat pentru urmărire.",
      "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.":
        "Să testăm recepția RECV-10042. Scanați paletul PLT-000184, apoi produsul. Vom încerca intenționat un cod de bare necunoscut pentru a verifica recuperarea.",
      "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.":
        "Codul de bare necunoscut a fost respins. Am configurat o eroare clară și o reîncercare, astfel încât operatorul să poată continua fără a crea un produs necunoscut.",
      "Correction applied to this demo configuration. Retry the scan with the expected barcode.":
        "Corecție aplicată la această configurație demonstrativă. Reîncercați scanarea cu codul de bare așteptat.",
      "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.":
        "Captura datei de expirare este activată, deoarece ați confirmat mărfuri cu dată de expirare. Data rămâne asociată cu acest stoc de probă.",
      "Receipt complete. The unknown barcode test now has a clear block-and-retry rule.":
        "Recepție finalizată. Testul codului de bare necunoscut are acum o regulă clară de blocare și reîncercare.",
      "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.":
        "Acum plasați paletul recepționat. WMS-ul de probă sugerează A-01-02, folosind o verificare simulată a zonei de depozitare și a capacității. FEFO privește alegerea stocului după expirare, nu garantează că această locație este potrivită.",
      "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.":
        "Varianta de test intenționat incompletă a permis o verificare opțională a destinației. Simularea a detectat nepotrivirea. Am făcut obligatorie scanarea destinației și am blocat înlocuirea locației sugerate.",
      "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution.":
        "Depozitare finalizată. Întregul LPN a fost mutat cu cele 48 de unități. Scanarea obligatorie a destinației a împiedicat înlocuirea locației.",
      "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.":
        "Să culegem comanda de probă SO-10428 pe traseul A-01-02 → B-03-01. Vom testa un SKU greșit înainte de culegerea produsului corect.",
      "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.":
        "SKU-ul greșit a fost respins. Verificarea produsului este acum obligatorie înainte de finalizarea unei culegeri. Este un control configurat, nu o afirmație măsurată privind productivitatea.",
      "First line verified. Continue to B-03-01 for 6 EA of WATER-500.":
        "Prima linie a fost verificată. Continuați la B-03-01 pentru 6 EA de WATER-500.",
      "Picking complete. Both lines were checked and the sample order is now waiting for Packing.":
        "Culegere finalizată. Ambele linii au fost verificate, iar comanda de probă așteaptă acum ambalarea.",
      "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.":
        "Toate cele trei procese de probă au trecut. Faceți terminalul mai ușor de utilizat: încercați text mai mare, o ilustrație a produsului sau un sunet de eroare. Modificările apar imediat.",
      "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.":
        "Acum verificați meniul operatorului. Conține doar Recepție, Depozitare și Culegere. Administrarea, politicile, utilizatorii și datele financiare sunt excluse din acest rol simulat.",
      "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.":
        "Configurația a trecut trei scenarii de afaceri de probă. Niciun depozit nu a fost activat. Un administrator ar analiza acest rezultat înainte de un pas separat de activare. Lăsați adresa de e-mail de serviciu dacă doriți să discutați configurarea cu Quark.",
      "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.":
        "Rezultatul demonstrației a fost confirmat. Nu s-a implementat nimic. Puteți lăsa adresa de e-mail pentru a analiza pașii următori cu echipa Quark.",
      "Replaying the same confirmed sample warehouse. No new answers are needed.":
        "Reluăm același depozit de probă confirmat. Nu sunt necesare răspunsuri noi.",
      "First run the controlled error test, then apply the correction and retry.":
        "Rulați mai întâi testul controlat de eroare, apoi aplicați corecția și reîncercați.",
      "Run the highlighted error test before finishing this demo process.":
        "Rulați testul de eroare evidențiat înainte de a finaliza acest proces demonstrativ.",
      "Scan accepted": "Scanare acceptată",
      Confirmed: "Confirmat",
      "Awaiting scan": "Se așteaptă scanarea",
      "Scanned destination": "Destinație scanată",
      "Demo language": "Limba demonstrației",
      "Sending…": "Se trimite…",
      Sent: "Trimis",
      "Your setup was accepted. Thank you — the Quark team will follow up.":
        "Configurarea dumneavoastră a fost acceptată. Vă mulțumim — echipa Quark va reveni cu un răspuns.",
      "The request timed out. Please check before resending.":
        "Cererea a expirat. Verificați înainte de a o retrimite.",
      "AI took too long. Your message is kept; retry or use the guided choices.":
        "AI a durat prea mult. Mesajul dumneavoastră a fost păstrat; reîncercați sau folosiți opțiunile ghidate.",
      "Could not send this setup. Please retry or email hello@quark.build.":
        "Configurarea nu a putut fi trimisă. Reîncercați sau scrieți la hello@quark.build.",
      Configuration: "Configurare",
      "Sample product illustration": "Ilustrație de produs de probă",
      "Terminal session": "Sesiune de terminal",
      "Terminal view": "Vizualizare terminal",
      "Warehouse terminal preview": "Previzualizare terminal depozit",
      "Choose a JPEG, PNG or PDF up to 3 MB.":
        "Alegeți un fișier JPEG, PNG sau PDF de cel mult 3 MB.",
      "Could not read the file.": "Fișierul nu a putut fi citit.",
      "AI is unavailable. Use the guided choices to continue.":
        "AI nu este disponibil. Folosiți opțiunile ghidate pentru a continua.",
      "AI returned an unexpected response. The guided sample is still available.":
        "AI a returnat un răspuns neașteptat. Exemplul ghidat este în continuare disponibil.",
      "{count} events": "{count} evenimente",
      "Configuration · {count}/3 sample processes":
        "Configurare · {count}/3 procese de probă",
      "{process} simulation started": "Simularea {process} a început",
      "{process} sample passed": "{process} de probă a trecut",
      "Try the {process} task": "Încercați sarcina {process}",
      "Wrong product. Expected {value}.": "Produs greșit. Așteptat: {value}.",
      "Wrong source location. Expected {value}.":
        "Locație sursă greșită. Așteptat: {value}.",
      "Wrong pallet. Expected {value}.": "Palet greșit. Așteptat: {value}.",
      "Quantity mismatch. Expected {count} EA.":
        "Cantitate nepotrivită. Așteptat: {count} EA.",
      "Expected: {value}": "Așteptat: {value}",
      "{count} / 48 units scanned": "{count} / 48 unități scanate",
      "{count} EA": "{count} EA",
      "line {current}/{total}": "linia {current}/{total}",
      "{count} Case × {units}": "{count} Cutie × {units}",
      "Sent only with your next AI message":
        "Trimis doar cu următorul mesaj AI",
      "{setting}: On": "{setting}: Pornit",
      "{setting}: Off": "{setting}: Oprit",
      "Switch the demo to {language}?":
        "Doriți să comutați demonstrația în {language}?",
      "Switch language": "Schimbă limba",
      "Keep current language": "Păstrează limba curentă",
      "Language switched. Your progress is preserved.":
        "Limba a fost schimbată. Progresul dumneavoastră a fost păstrat.",
      receiving: "recepție",
      putaway: "depozitare",
      picking: "culegere",
      "Scan or type": "Scanați sau scrieți",
      Loading: "Se încarcă",
      Received: "Recepționat",
      Blocked: "Blocat",
      "For this guided sample, I will use the milk example. Your product remains part of the discussion.":
        "Pentru acest exemplu ghidat, voi folosi exemplul cu lapte. Produsul dumneavoastră rămâne parte din discuție.",
      "The assistant can offer to switch the language when you write in another language.":
        "Asistentul poate propune schimbarea limbii când scrieți într-o altă limbă.",
      "Handheld keyboard": "Tastatura terminalului",
      "Device key {value}": "Tasta {value}",
      "Sample carton": "Cutie de exemplu",
      "Sample carton illustration": "Ilustrație a unei cutii de exemplu",
    },
    el: {
      "AI onboarding · guided demo":
        "Επιγραμματική ξενάγηση AI · καθοδηγούμενη επίδειξη",
      "Local RF simulation": "Τοπική προσομοίωση RF",
      "Setup assistant": "Βοηθός ρύθμισης",
      "Configure · simulate · improve": "Ρύθμιση · προσομοίωση · βελτίωση",
      Activity: "Δραστηριότητα",
      Live: "Ζωντανά",
      LIVE: "ΖΩΝΤΑΝΑ",
      Chat: "Συνομιλία",
      RF: "RF",
      "Message to setup assistant": "Μήνυμα προς βοηθό ρύθμισης",
      "Send message": "Αποστολή μηνύματος",
      "Attach warehouse plan": "Επισύναψη σχεδίου αποθήκης",
      "Remove plan": "Αφαίρεση σχεδίου",
      "Toggle theme": "Εναλλαγή θέματος",
      "Reset demo": "Επαναφορά επίδειξης",
      "Collapse chat": "Σύμπτυξη συνομιλίας",
      "Show activity": "Εμφάνιση δραστηριότητας",
      "Continue setup chat": "Συνέχεια συνομιλίας ρύθμισης",
      "Answer or ask Quark AI…": "Απαντήστε ή ρωτήστε τον Quark AI…",
      Privacy: "Απόρρητο",
      "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
        "Μόνο τα μηνύματα που στέλνετε και τα επιλεγμένα αρχεία αποστέλλονται στο Quark AI. Οι καθοδηγούμενες επιλογές και οι ενέργειες RF παραμένουν σε αυτή τη σελίδα.",
      "What do you store?": "Τι αποθηκεύετε;",
      "Ordinary goods": "Συνηθισμένα εμπορεύματα",
      "Goods with expiry dates": "Εμπορεύματα με ημερομηνίες λήξης",
      "Serial-controlled goods": "Εμπορεύματα με σειριακούς αριθμούς",
      "How are goods handled?": "Πώς χειρίζεστε τα εμπορεύματα;",
      "Pallets, cases and units": "Παλέτες, κιβώτια και μονάδες",
      "Cases and units": "Κιβώτια και μονάδες",
      "Do operators scan product barcodes during receiving?":
        "Σαρώνουν οι χειριστές τον γραμμωτό κωδικό προϊόντος κατά την παραλαβή;",
      "Yes, product scan is required": "Ναι, απαιτείται σάρωση προϊόντος",
      "Not consistently yet": "Όχι σταθερά ακόμη",
      "How is quantity confirmed?": "Πώς επιβεβαιώνεται η ποσότητα;",
      "Enter the quantity": "Εισαγάγετε την ποσότητα",
      "Scan each unit": "Σαρώστε κάθε μονάδα",
      "Who chooses the putaway location?":
        "Ποιος επιλέγει τη θέση τοποθέτησης;",
      "The WMS suggests a location": "Το WMS προτείνει μια θέση",
      "The operator chooses": "Την επιλέγει ο χειριστής",
      "How do operators pick orders?":
        "Πώς παραλαμβάνουν οι χειριστές τις παραγγελίες;",
      "One order at a time": "Μία παραγγελία τη φορά",
      "In waves": "Σε κύματα",
      "Do you check the product before packing is completed?":
        "Ελέγχετε το προϊόν πριν ολοκληρωθεί η συσκευασία;",
      "Yes, product check required": "Ναι, απαιτείται έλεγχος προϊόντος",
      "Not currently": "Προς το παρόν όχι",
      "Use General Distribution sample": "Χρήση δείγματος Γενικής Διανομής",
      "The sample includes one expiry-dated milk line. No serial capture.":
        "Το δείγμα περιλαμβάνει μία γραμμή γάλακτος με ημερομηνία λήξης. Χωρίς καταγραφή σειριακών αριθμών.",
      "Confirmed warehouse facts": "Επιβεβαιωμένα στοιχεία αποθήκης",
      "Prepare mobile processes →": "Προετοιμασία κινητών διαδικασιών →",
      "Warehouse model confirmed": "Το μοντέλο αποθήκης επιβεβαιώθηκε",
      "Operator permissions configured": "Τα δικαιώματα χειριστών ρυθμίστηκαν",
      "Receiving example prepared": "Προετοιμάστηκε το παράδειγμα παραλαβής",
      "Putaway example prepared": "Προετοιμάστηκε το παράδειγμα τοποθέτησης",
      "Picking example prepared": "Προετοιμάστηκε το παράδειγμα επιλογής",
      "→ Preparing the virtual handheld":
        "→ Προετοιμασία εικονικής φορητής συσκευής",
      Before: "Πριν",
      After: "Μετά",
      "Unknown product barcode": "Άγνωστος γραμμωτός κωδικός προϊόντος",
      "No recovery rule": "Χωρίς κανόνα ανάκτησης",
      "Block and offer retry": "Αποκλεισμός και προσφορά νέας δοκιμής",
      "Target location scan": "Σάρωση θέσης προορισμού",
      "Optional in test variant": "Προαιρετικό στη δοκιμαστική έκδοση",
      Required: "Υποχρεωτικό",
      "Product check before pick completion":
        "Έλεγχος προϊόντος πριν την ολοκλήρωση επιλογής",
      "Apply correction & retry →": "Εφαρμογή διόρθωσης και νέα δοκιμή →",
      "Apply correction & retry": "Εφαρμογή διόρθωσης και νέα δοκιμή",
      "Test putaway →": "Δοκιμή τοποθέτησης →",
      "Test picking →": "Δοκιμή επιλογής →",
      "Customize the handheld →": "Προσαρμογή φορητής συσκευής →",
      "Make the handheld fit your team":
        "Προσαρμόστε τη φορητή συσκευή στην ομάδα σας",
      "Larger text": "Μεγαλύτερο κείμενο",
      "Hide extra fields": "Απόκρυψη επιπλέον πεδίων",
      "Show sample product illustration":
        "Εμφάνιση δείγματος εικόνας προϊόντος",
      "Play an error sound": "Αναπαραγωγή ήχου σφάλματος",
      "Enable short action codes": "Ενεργοποίηση σύντομων κωδικών ενεργειών",
      "Show why a scan is blocked": "Εμφάνιση του λόγου αποκλεισμού σάρωσης",
      "Confirm quantity before completion":
        "Επιβεβαίωση ποσότητας πριν την ολοκλήρωση",
      "Handheld language": "Γλώσσα φορητής συσκευής",
      "Action controls and menu headings switch language; sample product identifiers stay unchanged.":
        "Τα στοιχεία ελέγχου ενεργειών και οι επικεφαλίδες μενού αλλάζουν γλώσσα· οι κωδικοί δειγματικών προϊόντων παραμένουν αμετάβλητοι.",
      "Check operator permissions →": "Έλεγχος δικαιωμάτων χειριστή →",
      "Warehouse Operator": "Χειριστής αποθήκης",
      "Excluded from the operator role:": "Εξαιρούνται από τον ρόλο χειριστή:",
      Administration: "Διαχείριση",
      "Policy changes": "Αλλαγές πολιτικής",
      "User management": "Διαχείριση χρηστών",
      "Financial data": "Οικονομικά δεδομένα",
      "Unassigned operations": "Μη ανατεθειμένες εργασίες",
      "This checks the simulated menu, not access to a live system.":
        "Αυτό ελέγχει το προσομοιωμένο μενού, όχι την πρόσβαση σε ενεργό σύστημα.",
      "Review onboarding result →": "Εξέταση αποτελέσματος εισαγωγής →",
      "Warehouse mobile configuration ready":
        "Η mobile ρύθμιση αποθήκης είναι έτοιμη",
      "Guided demo results · sample warehouse only":
        "Αποτελέσματα επίδειξης με οδηγό · μόνο δείγμα αποθήκης",
      "Receiving — Validated in demo": "Παραλαβή — Επικυρώθηκε στην επίδειξη",
      "Putaway — Validated in demo": "Τοποθέτηση — Επικυρώθηκε στην επίδειξη",
      "Picking — Validated in demo":
        "Λήψη παραγγελίας — Επικυρώθηκε στην επίδειξη",
      "Barcode controls — Enabled": "Έλεγχοι barcode — Ενεργοποιημένοι",
      "Location verification — Required": "Επαλήθευση θέσης — Απαιτείται",
      "Operator permissions — Verified in demo":
        "Δικαιώματα χειριστή — Επαληθεύτηκε στην επίδειξη",
      "TSD layout — Customized": "Διάταξη TSD — Προσαρμοσμένη",
      "Business scenarios — 3/3 passed":
        "Επιχειρηματικά σενάρια — 3/3 επιτυχημένα",
      "Discuss my setup · leave work email →":
        "Συζήτηση για τη ρύθμισή μου · αφήστε το email εργασίας →",
      "Review configuration": "Εξέταση ρύθμισης",
      "Replay simulation": "Επανάληψη προσομοίωσης",
      "Approve onboarding result": "Έγκριση αποτελέσματος εισαγωγής",
      "Demo result acknowledged. No activation was performed.":
        "Το αποτέλεσμα της επίδειξης αναγνωρίστηκε. Δεν πραγματοποιήθηκε ενεργοποίηση.",
      Receiving: "Παραλαβή",
      Putaway: "Τοποθέτηση",
      Picking: "Λήψη παραγγελίας",
      "Receiving · Putaway · Picking":
        "Παραλαβή · Τοποθέτηση · Λήψη παραγγελίας",
      "Receiving, Putaway, Picking": "Παραλαβή, Τοποθέτηση, Λήψη παραγγελίας",
      "✓ Receiving · Putaway · Picking":
        "✓ Παραλαβή · Τοποθέτηση · Λήψη παραγγελίας",
      "Your mobile processes": "Οι mobile διαδικασίες σας",
      "Confirm warehouse facts in chat to prepare the sample.":
        "Επιβεβαιώστε τα στοιχεία της αποθήκης στη συνομιλία για την προετοιμασία του δείγματος.",
      "Confirm warehouse facts in chat.":
        "Επιβεβαιώστε τα στοιχεία της αποθήκης στη συνομιλία.",
      "Waiting for warehouse facts": "Αναμονή για στοιχεία αποθήκης",
      "Preparing the sample configuration":
        "Προετοιμασία της δειγματικής ρύθμισης",
      "Discover warehouse": "Ανακάλυψη αποθήκης",
      "Prepare mobile processes": "Προετοιμασία mobile διαδικασιών",
      "Customize the handheld": "Προσαρμογή της φορητής συσκευής",
      "Check operator access": "Έλεγχος πρόσβασης χειριστή",
      "Demo checks complete": "Ολοκληρώθηκαν οι έλεγχοι επίδειξης",
      "Demo result acknowledged": "Το αποτέλεσμα της επίδειξης αναγνωρίστηκε",
      "Review sample result": "Εξέταση αποτελέσματος δείγματος",
      Pallet: "Παλέτα",
      Product: "Προϊόν",
      Expected: "Αναμενόμενο",
      Contents: "Περιεχόμενο",
      "Suggested bin": "Προτεινόμενη θέση",
      Order: "Παραγγελία",
      Source: "Προέλευση",
      Quantity: "Ποσότητα",
      "Quantity (EA)": "Ποσότητα (EA)",
      "Expiry date": "Ημερομηνία λήξης",
      "Scan pallet": "Σκανάρετε την παλέτα",
      "Scan product": "Σκανάρετε το προϊόν",
      "Confirm expected quantity": "Επιβεβαιώστε την αναμενόμενη ποσότητα",
      "Enter expiry date": "Εισαγάγετε ημερομηνία λήξης",
      "Complete receipt": "Ολοκληρώστε την παραλαβή",
      "Scan suggested location": "Σκανάρετε την προτεινόμενη θέση",
      "Confirm putaway": "Επιβεβαιώστε την τοποθέτηση",
      "Scan source location": "Σκανάρετε τη θέση προέλευσης",
      "Confirm pick quantity": "Επιβεβαιώστε την ποσότητα λήψης",
      "Confirm pick line": "Επιβεβαιώστε τη γραμμή λήψης",
      "Review the accepted scans and complete this step.":
        "Ελέγξτε τα αποδεκτά σκαναρίσματα και ολοκληρώστε αυτό το βήμα.",
      "Sample zone match · free capacity. Target scan verifies the suggested bin.":
        "Αντιστοίχιση δειγματικής ζώνης · ελεύθερη χωρητικότητα. Το σκανάρισμα στόχου επαληθεύει την προτεινόμενη θέση.",
      "Controlled error test": "Δοκιμή ελεγχόμενου σφάλματος",
      "Try a wrong barcode before accepting the correct scan.":
        "Δοκιμάστε λάθος barcode πριν αποδεχτείτε το σωστό σκανάρισμα.",
      "Try a wrong bin before accepting the correct scan.":
        "Δοκιμάστε λάθος θέση πριν αποδεχτείτε το σωστό σκανάρισμα.",
      "Scan UNKNOWN-999": "Σκανάρετε UNKNOWN-999",
      "Scan A-02-04": "Σκανάρετε A-02-04",
      Scan: "Σάρωση",
      Confirm: "Επιβεβαίωση",
      "Unknown product barcode. Please retry.":
        "Άγνωστο barcode προϊόντος. Δοκιμάστε ξανά.",
      "Wrong location. Expected A-01-02.": "Λάθος θέση. Αναμενόμενη: A-01-02.",
      "Enter a valid future expiry date.":
        "Εισαγάγετε έγκυρη μελλοντική ημερομηνία λήξης.",
      "Task complete": "Η εργασία ολοκληρώθηκε",
      "Sample checks passed": "Οι έλεγχοι δείγματος πέρασαν",
      "No live warehouse changes": "Χωρίς αλλαγές σε ενεργή αποθήκη",
      "Review the configuration change in chat":
        "Ελέγξτε την αλλαγή ρύθμισης στη συνομιλία",
      "Live layout preview": "Προεπισκόπηση ενεργής διάταξης",
      "Handheld layout preview": "Προεπισκόπηση διάταξης φορητής συσκευής",
      "Preview only · no stock change":
        "Μόνο προεπισκόπηση · χωρίς αλλαγή αποθέματος",
      "Test error feedback": "Δοκιμή μηνυμάτων σφάλματος",
      "Operator menu": "Μενού χειριστή",
      "Assigned process": "Ανατεθειμένη διαδικασία",
      "Only assigned warehouse tasks.": "Μόνο ανατεθειμένες εργασίες αποθήκης.",
      "No administration access.": "Χωρίς πρόσβαση διαχείρισης.",
      "Simulated role · 3 processes": "Προσομοιωμένος ρόλος · 3 διαδικασίες",
      Handheld: "Φορητή συσκευή",
      Forklift: "Περονοφόρο",
      "GUIDED SIMULATION": "ΚΑΘΟΔΗΓΟΥΜΕΝΗ ΠΡΟΣΟΜΟΙΩΣΗ",
      "QUARK / GUIDED SIMULATION": "QUARK / ΚΑΘΟΔΗΓΟΥΜΕΝΗ ΠΡΟΣΟΜΟΙΩΣΗ",
      "SAMPLE CHECKS PASSED": "ΟΙ ΕΛΕΓΧΟΙ ΔΕΙΓΜΑΤΟΣ ΟΛΟΚΛΗΡΩΘΗΚΑΝ",
      "WAREHOUSE OPERATOR": "ΧΕΙΡΙΣΤΗΣ ΑΠΟΘΗΚΗΣ",
      "Continue on the handheld": "Συνέχεια στη φορητή συσκευή",
      "Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.":
        "Χρησιμοποιήστε τα κουμπιά της φορητής συσκευής για να δοκιμάσετε την ενέργεια μόνοι σας. Οι αποδεκτές ενέργειες εμφανίζονται στη Δραστηριότητα.",
      Role: "Ρόλος",
      Processes: "Διαδικασίες",
      "Target scan": "Σάρωση προορισμού",
      "Product check": "Έλεγχος προϊόντος",
      Activation: "Ενεργοποίηση",
      "Separate administrator step": "Ξεχωριστό βήμα διαχειριστή",
      "Quark AI is replying…": "Η τεχνητή νοημοσύνη Quark απαντά…",
      Stop: "Διακοπή",
      "Retry AI": "Νέα προσπάθεια AI",
      "Earlier AI reply. Ask again in this language.":
        "Προηγούμενη απάντηση AI. Ρωτήστε ξανά σε αυτή τη γλώσσα.",
      "Continue with your warehouse setup":
        "Συνεχίστε με τη ρύθμιση της αποθήκης σας",
      "Send this example to the Quark team. We will follow up about your warehouse.":
        "Στείλτε αυτό το παράδειγμα στην ομάδα Quark. Θα επικοινωνήσουμε μαζί σας για την αποθήκη σας.",
      "Work email": "Εργασιακό email",
      Company: "Εταιρεία",
      "Send my contact details and this demo setup to Quark for follow-up.":
        "Στείλτε τα στοιχεία επικοινωνίας μου και αυτή τη ρύθμιση επίδειξης στην Quark για παρακολούθηση.",
      "Privacy policy": "Πολιτική απορρήτου",
      "Send my setup to Quark →": "Στείλτε τη ρύθμισή μου στην Quark →",
      Close: "Κλείσιμο",
      "Review sample configuration": "Επισκόπηση δείγματος διαμόρφωσης",
      "Configured controls": "Ρυθμισμένα στοιχεία ελέγχου",
      "No production activation or live permissions test.":
        "Χωρίς ενεργοποίηση παραγωγής ή δοκιμή δικαιωμάτων σε πραγματικό χρόνο.",
      "Guided demo started": "Η καθοδηγούμενη επίδειξη ξεκίνησε",
      "Sample data · no live warehouse connection":
        "Δεδομένα δείγματος · χωρίς σύνδεση με πραγματική αποθήκη",
      "Sample warehouse selected": "Επιλέχθηκε αποθήκη δείγματος",
      "Includes an expiry-dated milk line. No serial numbers.":
        "Περιλαμβάνει γραμμή γάλακτος με ημερομηνία λήξης. Χωρίς σειριακούς αριθμούς.",
      "Warehouse fact confirmed": "Το στοιχείο αποθήκης επιβεβαιώθηκε",
      "Configuration started": "Η διαμόρφωση ξεκίνησε",
      "Existing process templates; no new business logic generated":
        "Υπάρχοντα πρότυπα διαδικασιών· δεν δημιουργείται νέα επιχειρησιακή λογική",
      "Use Scan, Confirm and Retry yourself":
        "Χρησιμοποιήστε μόνοι σας τις επιλογές Σάρωση, Επιβεβαίωση και Νέα προσπάθεια",
      "Scan blocked": "Η σάρωση μπλοκαρίστηκε",
      "Configuration correction proposed": "Προτάθηκε διόρθωση διαμόρφωσης",
      "Correction applied": "Η διόρθωση εφαρμόστηκε",
      "Operator action accepted": "Η ενέργεια χειριστή έγινε αποδεκτή",
      "48 EA received": "Παραλήφθηκαν 48 EA",
      "48 EA stored at A-01-02": "Αποθηκεύτηκαν 48 EA στο A-01-02",
      "2 lines · 18 EA · sent to Packing":
        "2 γραμμές · 18 EA · στάλθηκαν στη συσκευασία",
      "First order line completed": "Ολοκληρώθηκε η πρώτη γραμμή παραγγελίας",
      "12 EA picked": "Ελήφθησαν 12 EA",
      "Handheld layout customized":
        "Προσαρμόστηκε η διάταξη της φορητής συσκευής",
      "Operator permissions checked": "Ελέγχθηκαν τα δικαιώματα χειριστή",
      "Only three assigned processes visible":
        "Εμφανίζονται μόνο οι τρεις ανατεθειμένες διαδικασίες",
      "No activation or production write":
        "Χωρίς ενεργοποίηση ή εγγραφή παραγωγής",
      "Handheld preference changed": "Άλλαξε η προτίμηση φορητής συσκευής",
      "Error feedback preview": "Προεπισκόπηση μηνυμάτων σφάλματος",
      "Visible feedback always shown; audio only when enabled":
        "Η ορατή ανατροφοδότηση εμφανίζεται πάντα· ο ήχος μόνο όταν είναι ενεργοποιημένος",
      "AI reply received": "Ελήφθη απάντηση AI",
      "Explanation and confirmed facts only; no warehouse actions":
        "Μόνο εξήγηση και επιβεβαιωμένα στοιχεία· χωρίς ενέργειες αποθήκης",
      "AI reply unavailable": "Η απάντηση AI δεν είναι διαθέσιμη",
      "The controlled simulation remains available":
        "Η ελεγχόμενη προσομοίωση παραμένει διαθέσιμη",
      "Configuration updated": "Η διαμόρφωση ενημερώθηκε",
      "Retry the expected barcode":
        "Δοκιμάστε ξανά τον αναμενόμενο γραμμωτό κώδικα",
      "48 EA · 2 cases × 24": "48 EA · 2 κιβώτια × 24",
      "12 EA": "12 EA",
      "6 EA": "6 EA",
      "one unit": "μία μονάδα",
      SCANNER: "ΣΑΡΩΤΗΣ",
      "Demo sections": "Ενότητες επίδειξης",
      "Activity and events": "Δραστηριότητα και συμβάντα",
      "Configuration details": "Λεπτομέρειες διαμόρφωσης",
      "Waiting for setup": "Αναμονή για ρύθμιση",
      "Configuration · waiting for facts": "Διαμόρφωση · αναμονή για στοιχεία",
      "SCANNED DESTINATION": "ΣΑΡΩΜΕΝΟΣ ΠΡΟΟΡΙΣΜΟΣ",
      "Quantity confirmation": "Επιβεβαίωση ποσότητας",
      Optional: "Προαιρετικό",
      "Action codes": "Κωδικοί ενεργειών",
      "1 Scan · 2 Confirm": "1 Σάρωση · 2 Επιβεβαίωση",
      "FORKLIFT TERMINAL · SIMULATION": "ΤΕΡΜΑΤΙΚΟ ΠΕΡΟΝΟΦΟΡΟΥ · ΠΡΟΣΟΜΟΙΩΣΗ",
      "[SCANNER]": "[SCANNER]",
      English: "Ελληνικά",
      "Handheld preferences": "Προτιμήσεις φορητού τερματικού",
      On: "Ενεργό",
      Off: "Ανενεργό",
      "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.":
        "Θα σας βοηθήσω να ρυθμίσετε τις κινητές διαδικασίες της αποθήκης σας. Πρώτα θα σας ρωτήσω για τη δουλειά σας, και στη συνέχεια θα δοκιμάσουμε την παραλαβή, την τοποθέτηση και τη συλλογή σε ένα εικονικό φορητό τερματικό. Χρησιμοποιήστε το δείγμα αποθήκης ή απαντήστε σε μία ερώτηση τη φορά.",
      "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.":
        "Χρήση Γενικής Διανομής: συνηθισμένα αγαθά συν μία γραμμή γάλακτος με ημερομηνία λήξης, παλέτες/κιβώτια/μονάδες, σάρωση προϊόντων και θέσεων, κατευθυνόμενη τοποθέτηση, συλλογή ανά παραγγελία και έλεγχοι συσκευασίας.",
      "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.":
        "Αυτά είναι επιβεβαιωμένα στοιχεία. Θα ρυθμίσω υπάρχουσες κινητές διαδικασίες και θα τις δοκιμάσω με δείγμα αποθέματος. Δεν είναι συνδεδεμένη καμία πραγματική αποθήκη.",
      "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.":
        "Χρησιμοποιείτε κύματα. Αυτή η σύντομη επίδειξη δοκιμάζει μία παραγγελία μέσα στη ροή συλλογής· δεν επικυρώνει τη διαδικασία απελευθέρωσης κυμάτων σας.",
      "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.":
        "Επιλέξατε αγαθά με έλεγχο σειριακών αριθμών. Αυτό το καθοδηγούμενο παράδειγμα διανομής χρησιμοποιεί γραμμή χωρίς σειριακούς αριθμούς και δεν επικυρώνει την καταγραφή τους. Η απαίτησή σας για σειριακούς αριθμούς παραμένει στη σύνοψη για περαιτέρω παρακολούθηση.",
      "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.":
        "Ας δοκιμάσουμε την παραλαβή RECV-10042. Σαρώστε την παλέτα PLT-000184, και μετά το προϊόν. Θα δοκιμάσουμε σκόπιμα έναν άγνωστο γραμμωτό κώδικα για να ελέγξουμε την ανάκαμψη.",
      "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.":
        "Ο άγνωστος γραμμωτός κώδικας απορρίφθηκε. Ρύθμισα ένα σαφές σφάλμα και επανάληψη, ώστε ο χειριστής να μπορεί να συνεχίσει χωρίς να δημιουργηθεί άγνωστο προϊόν.",
      "Correction applied to this demo configuration. Retry the scan with the expected barcode.":
        "Εφαρμόστηκε διόρθωση στη ρύθμιση επίδειξης. Επαναλάβετε τη σάρωση με τον αναμενόμενο γραμμωτό κώδικα.",
      "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.":
        "Η καταγραφή λήξης είναι ενεργή, επειδή επιβεβαιώσατε αγαθά με ημερομηνία λήξης. Η ημερομηνία παραμένει με αυτό το δείγμα αποθέματος.",
      "Receipt complete. The unknown barcode test now has a clear block-and-retry rule.":
        "Η παραλαβή ολοκληρώθηκε. Ο κανόνας αποκλεισμού και επανάληψης για τον άγνωστο γραμμωτό κώδικα είναι πλέον σαφής.",
      "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.":
        "Τώρα τοποθετήστε την παραληφθείσα παλέτα. Το δείγμα WMS προτείνει το A-01-02 με προσομοιωμένο έλεγχο ζώνης αποθήκευσης και χωρητικότητας. Το FEFO αφορά την επιλογή αποθέματος με βάση τη λήξη, όχι εγγύηση ότι αυτή η θέση είναι κατάλληλη.",
      "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.":
        "Η σκόπιμα ελλιπής δοκιμαστική παραλλαγή επέτρεψε προαιρετικό έλεγχο προορισμού. Η προσομοίωση εντόπισε την ασυμφωνία. Έκανα τη σάρωση προορισμού υποχρεωτική και μπλόκαρα την αντικατάσταση της προτεινόμενης θέσης.",
      "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution.":
        "Η τοποθέτηση ολοκληρώθηκε. Όλο το LPN μετακινήθηκε με τις 48 μονάδες του. Η υποχρεωτική σάρωση προορισμού απέτρεψε την αντικατάσταση θέσης.",
      "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.":
        "Ας συλλέξουμε τη δειγματική παραγγελία SO-10428 κατά μήκος της διαδρομής A-01-02 → B-03-01. Θα δοκιμάσουμε λάθος SKU πριν συλλέξουμε το σωστό προϊόν.",
      "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.":
        "Το λάθος SKU απορρίφθηκε. Η επαλήθευση προϊόντος απαιτείται πλέον πριν ολοκληρωθεί η συλλογή. Πρόκειται για ρυθμισμένο έλεγχο, όχι για μετρημένο ισχυρισμό παραγωγικότητας.",
      "First line verified. Continue to B-03-01 for 6 EA of WATER-500.":
        "Η πρώτη γραμμή επαληθεύτηκε. Συνεχίστε στο B-03-01 για 6 EA του WATER-500.",
      "Picking complete. Both lines were checked and the sample order is now waiting for Packing.":
        "Η συλλογή ολοκληρώθηκε. Και οι δύο γραμμές ελέγχθηκαν και η δειγματική παραγγελία περιμένει πλέον τη συσκευασία.",
      "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.":
        "Και οι τρεις δειγματικές διαδικασίες πέρασαν επιτυχώς. Κάντε το φορητό τερματικό πιο εύχρηστο: δοκιμάστε μεγαλύτερο κείμενο, εικόνα προϊόντος ή ηχητικό σφάλματος. Οι αλλαγές εμφανίζονται αμέσως.",
      "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.":
        "Τώρα ελέγξτε το μενού χειριστή. Περιέχει μόνο Παραλαβή, Τοποθέτηση και Συλλογή. Η διαχείριση, οι πολιτικές, οι χρήστες και τα οικονομικά δεδομένα εξαιρούνται από αυτόν τον προσομοιωμένο ρόλο.",
      "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.":
        "Η ρύθμιση πέρασε τρία δειγματικά επιχειρησιακά σενάρια. Δεν ενεργοποιήθηκε καμία αποθήκη. Ένας διαχειριστής θα εξέταζε αυτό το αποτέλεσμα πριν από ξεχωριστό βήμα ενεργοποίησης. Αφήστε το εργασιακό σας email αν θέλετε να συζητήσετε τη ρύθμιση με την Quark.",
      "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.":
        "Το αποτέλεσμα επίδειξης καταχωρίστηκε. Δεν αναπτύχθηκε τίποτα. Μπορείτε να αφήσετε το email σας για να εξετάσετε τα επόμενα βήματα με την ομάδα της Quark.",
      "Replaying the same confirmed sample warehouse. No new answers are needed.":
        "Επανάληψη της ίδιας επιβεβαιωμένης δειγματικής αποθήκης. Δεν χρειάζονται νέες απαντήσεις.",
      "First run the controlled error test, then apply the correction and retry.":
        "Εκτελέστε πρώτα τη ελεγχόμενη δοκιμή σφάλματος, και στη συνέχεια εφαρμόστε τη διόρθωση και επαναλάβετε.",
      "Run the highlighted error test before finishing this demo process.":
        "Εκτελέστε την επισημασμένη δοκιμή σφάλματος πριν ολοκληρώσετε αυτή τη διαδικασία επίδειξης.",
      "Scan accepted": "Η σάρωση έγινε αποδεκτή",
      Confirmed: "Επιβεβαιώθηκε",
      "Awaiting scan": "Αναμονή σάρωσης",
      "Scanned destination": "Σαρωμένος προορισμός",
      "Demo language": "Γλώσσα επίδειξης",
      "Sending…": "Αποστολή…",
      Sent: "Εστάλη",
      "Your setup was accepted. Thank you — the Quark team will follow up.":
        "Η ρύθμισή σας έγινε αποδεκτή. Ευχαριστούμε — η ομάδα της Quark θα επικοινωνήσει μαζί σας.",
      "The request timed out. Please check before resending.":
        "Το αίτημα έληξε λόγω χρονικού ορίου. Ελέγξτε πριν το στείλετε ξανά.",
      "AI took too long. Your message is kept; retry or use the guided choices.":
        "Η AI άργησε πολύ. Το μήνυμά σας διατηρείται· δοκιμάστε ξανά ή χρησιμοποιήστε τις καθοδηγούμενες επιλογές.",
      "Could not send this setup. Please retry or email hello@quark.build.":
        "Δεν ήταν δυνατή η αποστολή αυτής της ρύθμισης. Δοκιμάστε ξανά ή στείλτε email στο hello@quark.build.",
      Configuration: "Ρύθμιση",
      "Sample product illustration": "Εικόνα δειγματικού προϊόντος",
      "Terminal session": "Συνεδρία τερματικού",
      "Terminal view": "Προβολή τερματικού",
      "Warehouse terminal preview": "Προεπισκόπηση τερματικού αποθήκης",
      "Choose a JPEG, PNG or PDF up to 3 MB.":
        "Επιλέξτε αρχείο JPEG, PNG ή PDF έως 3 MB.",
      "Could not read the file.": "Δεν ήταν δυνατή η ανάγνωση του αρχείου.",
      "AI is unavailable. Use the guided choices to continue.":
        "Η AI δεν είναι διαθέσιμη. Χρησιμοποιήστε τις καθοδηγούμενες επιλογές για να συνεχίσετε.",
      "AI returned an unexpected response. The guided sample is still available.":
        "Η AI επέστρεψε μη αναμενόμενη απάντηση. Το καθοδηγούμενο δείγμα εξακολουθεί να είναι διαθέσιμο.",
      "{count} events": "{count} συμβάντα",
      "Configuration · {count}/3 sample processes":
        "Ρύθμιση · {count}/3 δειγματικές διαδικασίες",
      "{process} simulation started": "Η προσομοίωση {process} ξεκίνησε",
      "{process} sample passed": "Το δείγμα {process} πέρασε",
      "Try the {process} task": "Δοκιμάστε την εργασία {process}",
      "Wrong product. Expected {value}.": "Λάθος προϊόν. Αναμενόταν {value}.",
      "Wrong source location. Expected {value}.":
        "Λάθος θέση προέλευσης. Αναμενόταν {value}.",
      "Wrong pallet. Expected {value}.": "Λάθος παλέτα. Αναμενόταν {value}.",
      "Quantity mismatch. Expected {count} EA.":
        "Ασυμφωνία ποσότητας. Αναμενόταν {count} EA.",
      "Expected: {value}": "Αναμενόμενο: {value}",
      "{count} / 48 units scanned": "{count} / 48 μονάδες σαρώθηκαν",
      "{count} EA": "{count} EA",
      "line {current}/{total}": "γραμμή {current}/{total}",
      "{count} Case × {units}": "{count} Κιβώτιο × {units}",
      "Sent only with your next AI message":
        "Αποστέλλεται μόνο με το επόμενο μήνυμά σας στην AI",
      "{setting}: On": "{setting}: Ενεργό",
      "{setting}: Off": "{setting}: Ανενεργό",
      "Switch the demo to {language}?": "Να αλλάξει η επίδειξη σε {language};",
      "Switch language": "Αλλαγή γλώσσας",
      "Keep current language": "Διατήρηση τρέχουσας γλώσσας",
      "Language switched. Your progress is preserved.":
        "Η γλώσσα άλλαξε. Η πρόοδός σας διατηρήθηκε.",
      receiving: "παραλαβή",
      putaway: "τοποθέτηση",
      picking: "συλλογή",
      "Scan or type": "Σαρώστε ή πληκτρολογήστε",
      Loading: "Φόρτωση",
      Received: "Παραλήφθηκε",
      Blocked: "Αποκλεισμένο",
      "For this guided sample, I will use the milk example. Your product remains part of the discussion.":
        "Για αυτό το καθοδηγούμενο δείγμα, θα χρησιμοποιήσω το παράδειγμα του γάλακτος. Το προϊόν σας παραμένει μέρος της συζήτησης.",
      "The assistant can offer to switch the language when you write in another language.":
        "Ο βοηθός μπορεί να προτείνει αλλαγή γλώσσας όταν γράφετε σε άλλη γλώσσα.",
      "Handheld keyboard": "Πληκτρολόγιο τερματικού",
      "Device key {value}": "Πλήκτρο {value}",
      "Sample carton": "Ενδεικτικό κιβώτιο",
      "Sample carton illustration": "Εικόνα ενδεικτικού κιβωτίου",
    },
    sr: {
      "AI onboarding · guided demo": "AI uvođenje · vođeni demo",
      "Local RF simulation": "Lokalna RF simulacija",
      "Setup assistant": "Asistent za podešavanje",
      "Configure · simulate · improve": "Podesi · simuliraj · poboljšaj",
      Activity: "Aktivnost",
      Live: "Uživo",
      LIVE: "UŽIVO",
      Chat: "Ćaskanje",
      RF: "RF",
      "Message to setup assistant": "Poruka asistentu za podešavanje",
      "Send message": "Pošalji poruku",
      "Attach warehouse plan": "Priloži plan skladišta",
      "Remove plan": "Ukloni plan",
      "Toggle theme": "Promeni temu",
      "Reset demo": "Resetuj demo",
      "Collapse chat": "Sažmi ćaskanje",
      "Show activity": "Prikaži aktivnost",
      "Continue setup chat": "Nastavi ćaskanje o podešavanju",
      "Answer or ask Quark AI…": "Odgovori ili postavi pitanje Quark AI-ju…",
      Privacy: "Privatnost",
      "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
        "Samo poruke koje pošaljete i odabrani fajlovi idu Quark AI-ju. Vođeni izbori i RF radnje ostaju na ovoj stranici.",
      "What do you store?": "Šta čuvate?",
      "Ordinary goods": "Obična roba",
      "Goods with expiry dates": "Roba sa rokom trajanja",
      "Serial-controlled goods": "Roba sa kontrolom serijskih brojeva",
      "How are goods handled?": "Kako se roba obrađuje?",
      "Pallets, cases and units": "Paleti, kutije i jedinice",
      "Cases and units": "Kutije i jedinice",
      "Do operators scan product barcodes during receiving?":
        "Da li radnici skeniraju barkod proizvoda pri prijemu?",
      "Yes, product scan is required": "Da, skeniranje proizvoda je obavezno",
      "Not consistently yet": "Još nije dosledno",
      "How is quantity confirmed?": "Kako se potvrđuje količina?",
      "Enter the quantity": "Unesite količinu",
      "Scan each unit": "Skenirajte svaku jedinicu",
      "Who chooses the putaway location?": "Ko bira lokaciju za skladištenje?",
      "The WMS suggests a location": "WMS predlaže lokaciju",
      "The operator chooses": "Radnik bira lokaciju",
      "How do operators pick orders?": "Kako radnici kompletiraju porudžbine?",
      "One order at a time": "Jedna porudžbina po jedan",
      "In waves": "Po talasima",
      "Do you check the product before packing is completed?":
        "Da li proveravate proizvod pre završetka pakovanja?",
      "Yes, product check required": "Da, provera proizvoda je obavezna",
      "Not currently": "Trenutno ne",
      "Use General Distribution sample": "Koristi uzorak Opšte distribucije",
      "The sample includes one expiry-dated milk line. No serial capture.":
        "Uzorak sadrži jednu stavku mleka sa rokom trajanja. Nema hvatanja serijskih brojeva.",
      "Confirmed warehouse facts": "Potvrđene činjenice o skladištu",
      "Prepare mobile processes →": "Pripremi mobilne procese →",
      "Warehouse model confirmed": "Model skladišta potvrđen",
      "Operator permissions configured": "Dozvole radnika podešene",
      "Receiving example prepared": "Pripremljen primer prijema",
      "Putaway example prepared": "Pripremljen primer skladištenja",
      "Picking example prepared": "Pripremljen primer kompletiranja",
      "→ Preparing the virtual handheld":
        "→ Priprema virtuelnog ručnog uređaja",
      Before: "Pre",
      After: "Posle",
      "Unknown product barcode": "Nepoznat barkod proizvoda",
      "No recovery rule": "Nema pravila za oporavak",
      "Block and offer retry": "Blokiraj i ponudi ponovni pokušaj",
      "Target location scan": "Skeniranje ciljne lokacije",
      "Optional in test variant": "Opciono u test varijanti",
      Required: "Obavezno",
      "Product check before pick completion":
        "Provera proizvoda pre završetka kompletiranja",
      "Apply correction & retry →": "Primeni ispravku i pokušaj ponovo →",
      "Apply correction & retry": "Primeni ispravku i pokušaj ponovo",
      "Test putaway →": "Test skladištenja →",
      "Test picking →": "Test kompletiranja →",
      "Customize the handheld →": "Prilagodi ručni uređaj →",
      "Make the handheld fit your team": "Prilagodite ručni uređaj svom timu",
      "Larger text": "Veći tekst",
      "Hide extra fields": "Sakrij dodatna polja",
      "Show sample product illustration":
        "Prikaži ilustraciju uzorka proizvoda",
      "Play an error sound": "Pusti zvuk greške",
      "Enable short action codes": "Omogući kratke kodove radnji",
      "Show why a scan is blocked": "Prikaži zašto je skeniranje blokirano",
      "Confirm quantity before completion": "Potvrdi količinu pre završetka",
      "Handheld language": "Jezik ručnog uređaja",
      "Action controls and menu headings switch language; sample product identifiers stay unchanged.":
        "Kontrole radnji i naslovi menija menjaju jezik; identifikatori uzoraka proizvoda ostaju nepromenjeni.",
      "Check operator permissions →": "Proveri dozvole radnika →",
      "Warehouse Operator": "Radnik skladišta",
      "Excluded from the operator role:": "Isključeno iz uloge radnika:",
      Administration: "Administracija",
      "Policy changes": "Promene politika",
      "User management": "Upravljanje korisnicima",
      "Financial data": "Finansijski podaci",
      "Unassigned operations": "Neraspoređene operacije",
      "This checks the simulated menu, not access to a live system.":
        "Ovo proverava simulirani meni, a ne pristup sistemu u radu.",
      "Review onboarding result →": "Pregledajte rezultat uvođenja →",
      "Warehouse mobile configuration ready":
        "Konfiguracija mobilnog skladišta je spremna",
      "Guided demo results · sample warehouse only":
        "Rezultati vođenog demo prikaza · samo probno skladište",
      "Receiving — Validated in demo": "Prijem — potvrđeno u demo prikazu",
      "Putaway — Validated in demo": "Skladištenje — potvrđeno u demo prikazu",
      "Picking — Validated in demo":
        "Komisioniranje — potvrđeno u demo prikazu",
      "Barcode controls — Enabled": "Kontrole barkoda — uključene",
      "Location verification — Required": "Provera lokacije — obavezna",
      "Operator permissions — Verified in demo":
        "Dozvole operatera — potvrđene u demo prikazu",
      "TSD layout — Customized": "Raspored TSD uređaja — prilagođen",
      "Business scenarios — 3/3 passed": "Poslovni scenariji — 3/3 prošlo",
      "Discuss my setup · leave work email →":
        "Razgovarajte o mom podešavanju · ostavite poslovnu e-poštu →",
      "Review configuration": "Pregledajte konfiguraciju",
      "Replay simulation": "Ponovi simulaciju",
      "Approve onboarding result": "Odobri rezultat uvođenja",
      "Demo result acknowledged. No activation was performed.":
        "Rezultat demo prikaza je potvrđen. Aktivacija nije izvršena.",
      Receiving: "Prijem",
      Putaway: "Skladištenje",
      Picking: "Komisioniranje",
      "Receiving · Putaway · Picking": "Prijem · Skladištenje · Komisioniranje",
      "Receiving, Putaway, Picking": "Prijem, Skladištenje, Komisioniranje",
      "✓ Receiving · Putaway · Picking":
        "✓ Prijem · Skladištenje · Komisioniranje",
      "Your mobile processes": "Vaši mobilni procesi",
      "Confirm warehouse facts in chat to prepare the sample.":
        "Potvrdite podatke o skladištu u razgovoru da pripremimo probni primer.",
      "Confirm warehouse facts in chat.":
        "Potvrdite podatke o skladištu u razgovoru.",
      "Waiting for warehouse facts": "Čeka se potvrda podataka o skladištu",
      "Preparing the sample configuration": "Priprema probne konfiguracije",
      "Discover warehouse": "Otkrijte skladište",
      "Prepare mobile processes": "Pripremite mobilne procese",
      "Customize the handheld": "Prilagodite ručni uređaj",
      "Check operator access": "Proverite pristup operatera",
      "Demo checks complete": "Provere demo prikaza su završene",
      "Demo result acknowledged": "Rezultat demo prikaza je potvrđen",
      "Review sample result": "Pregledajte rezultat probnog primera",
      Pallet: "Paleta",
      Product: "Proizvod",
      Expected: "Očekivano",
      Contents: "Sadržaj",
      "Suggested bin": "Predloženo mesto",
      Order: "Porudžbina",
      Source: "Izvor",
      Quantity: "Količina",
      "Quantity (EA)": "Količina (EA)",
      "Expiry date": "Datum isteka",
      "Scan pallet": "Skenirajte paletu",
      "Scan product": "Skenirajte proizvod",
      "Confirm expected quantity": "Potvrdite očekivanu količinu",
      "Enter expiry date": "Unesite datum isteka",
      "Complete receipt": "Završite prijem",
      "Scan suggested location": "Skenirajte predloženu lokaciju",
      "Confirm putaway": "Potvrdite skladištenje",
      "Scan source location": "Skenirajte izvornu lokaciju",
      "Confirm pick quantity": "Potvrdite količinu za komisioniranje",
      "Confirm pick line": "Potvrdite stavku za komisioniranje",
      "Review the accepted scans and complete this step.":
        "Pregledajte prihvaćena skeniranja i završite ovaj korak.",
      "Sample zone match · free capacity. Target scan verifies the suggested bin.":
        "Zona probnog primera se podudara · slobodan kapacitet. Ciljano skeniranje proverava predloženo mesto.",
      "Controlled error test": "Kontrolisani test grešaka",
      "Try a wrong barcode before accepting the correct scan.":
        "Probajte pogrešan barkod pre nego što prihvatite ispravno skeniranje.",
      "Try a wrong bin before accepting the correct scan.":
        "Probajte pogrešno mesto pre nego što prihvatite ispravno skeniranje.",
      "Scan UNKNOWN-999": "Skenirajte UNKNOWN-999",
      "Scan A-02-04": "Skenirajte A-02-04",
      Scan: "Skeniraj",
      Confirm: "Potvrdi",
      "Unknown product barcode. Please retry.":
        "Nepoznat barkod proizvoda. Pokušajte ponovo.",
      "Wrong location. Expected A-01-02.":
        "Pogrešna lokacija. Očekivano A-01-02.",
      "Enter a valid future expiry date.":
        "Unesite važeći datum isteka u budućnosti.",
      "Task complete": "Zadatak je završen",
      "Sample checks passed": "Provere probnog primera su prošle",
      "No live warehouse changes": "Nema promena u radnom skladištu",
      "Review the configuration change in chat":
        "Pregledajte promenu konfiguracije u razgovoru",
      "Live layout preview": "Pregled rasporeda uživo",
      "Handheld layout preview": "Pregled rasporeda ručnog uređaja",
      "Preview only · no stock change": "Samo pregled · bez promene zaliha",
      "Test error feedback": "Testiraj povratnu informaciju o grešci",
      "Operator menu": "Meni operatera",
      "Assigned process": "Dodeljen proces",
      "Only assigned warehouse tasks.": "Samo dodeljeni magacinski zadaci.",
      "No administration access.": "Nema pristupa administraciji.",
      "Simulated role · 3 processes": "Simulirana uloga · 3 procesa",
      Handheld: "Ručni terminal",
      Forklift: "Viljuškar",
      "GUIDED SIMULATION": "VODJENA SIMULACIJA",
      "QUARK / GUIDED SIMULATION": "QUARK / VODJENA SIMULACIJA",
      "SAMPLE CHECKS PASSED": "PROVERE UZORKA PROŠLE",
      "WAREHOUSE OPERATOR": "MAGACINSKI OPERATER",
      "Continue on the handheld": "Nastavite na ručnom terminalu",
      "Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.":
        "Koristite dugmad ručnog terminala da sami isprobate radnju. Prihvaćene radnje se pojavljuju u Aktivnostima.",
      Role: "Uloga",
      Processes: "Procesi",
      "Target scan": "Skeniranje cilja",
      "Product check": "Provera proizvoda",
      Activation: "Aktivacija",
      "Separate administrator step": "Poseban korak za administratora",
      "Quark AI is replying…": "Quark AI odgovara…",
      Stop: "Zaustavi",
      "Retry AI": "Pokušaj ponovo AI",
      "Earlier AI reply. Ask again in this language.":
        "Raniji odgovor AI. Pitajte ponovo na ovom jeziku.",
      "Continue with your warehouse setup":
        "Nastavite sa podešavanjem magacina",
      "Send this example to the Quark team. We will follow up about your warehouse.":
        "Pošaljite ovaj primer timu Quark. Javićemo se u vezi sa vašim magacinom.",
      "Work email": "Poslovni imejl",
      Company: "Kompanija",
      "Send my contact details and this demo setup to Quark for follow-up.":
        "Pošaljite moje kontakt podatke i ovo demo podešavanje kompaniji Quark radi praćenja.",
      "Privacy policy": "Politika privatnosti",
      "Send my setup to Quark →": "Pošalji moje podešavanje kompaniji Quark →",
      Close: "Zatvori",
      "Review sample configuration": "Pregledajte uzorak konfiguracije",
      "Configured controls": "Podešene kontrole",
      "No production activation or live permissions test.":
        "Nema aktivacije u produkciji niti provere živih dozvola.",
      "Guided demo started": "Vođeni demo je pokrenut",
      "Sample data · no live warehouse connection":
        "Podaci iz uzorka · nema veze sa živim magacinom",
      "Sample warehouse selected": "Izabran je uzorak magacina",
      "Includes an expiry-dated milk line. No serial numbers.":
        "Uključuje stavku mleka sa datumom isteka. Nema serijskih brojeva.",
      "Warehouse fact confirmed": "Činjenica o magacinu potvrđena",
      "Configuration started": "Podešavanje je započeto",
      "Existing process templates; no new business logic generated":
        "Postojeći šabloni procesa; nije generisana nova poslovna logika",
      "Use Scan, Confirm and Retry yourself":
        "Sami koristite Skeniraj, Potvrdi i Pokušaj ponovo",
      "Scan blocked": "Skeniranje blokirano",
      "Configuration correction proposed": "Predložena ispravka podešavanja",
      "Correction applied": "Ispravka primenjena",
      "Operator action accepted": "Radnja operatera prihvaćena",
      "48 EA received": "Primljeno 48 EA",
      "48 EA stored at A-01-02": "Smešteno 48 EA na A-01-02",
      "2 lines · 18 EA · sent to Packing":
        "2 stavke · 18 EA · poslato na pakovanje",
      "First order line completed": "Prva stavka porudžbine završena",
      "12 EA picked": "Pokupljeno 12 EA",
      "Handheld layout customized": "Raspored ručnog terminala prilagođen",
      "Operator permissions checked": "Dozvole operatera proverene",
      "Only three assigned processes visible":
        "Vidljiva su samo tri dodeljena procesa",
      "No activation or production write":
        "Nema aktivacije niti upisa u produkciju",
      "Handheld preference changed": "Podešavanje ručnog terminala promenjeno",
      "Error feedback preview": "Pregled povratne informacije o grešci",
      "Visible feedback always shown; audio only when enabled":
        "Vidljiva povratna informacija uvek se prikazuje; zvuk samo kada je uključen",
      "AI reply received": "Odgovor AI primljen",
      "Explanation and confirmed facts only; no warehouse actions":
        "Samo objašnjenje i potvrđene činjenice; bez radnji u magacinu",
      "AI reply unavailable": "Odgovor AI nije dostupan",
      "The controlled simulation remains available":
        "Kontrolisana simulacija ostaje dostupna",
      "Configuration updated": "Podešavanje ažurirano",
      "Retry the expected barcode": "Pokušajte ponovo sa očekivanim barkodom",
      "48 EA · 2 cases × 24": "48 EA · 2 kutije × 24",
      "12 EA": "12 EA",
      "6 EA": "6 EA",
      "one unit": "jedna jedinica",
      SCANNER: "SKENER",
      "Demo sections": "Odeljci demoa",
      "Activity and events": "Aktivnosti i događaji",
      "Configuration details": "Detalji podešavanja",
      "Waiting for setup": "Čeka se podešavanje",
      "Configuration · waiting for facts": "Podešavanje · čeka činjenice",
      "SCANNED DESTINATION": "SKENIRANO ODREDIŠTE",
      "Quantity confirmation": "Potvrda količine",
      Optional: "Opciono",
      "Action codes": "Kodovi radnji",
      "1 Scan · 2 Confirm": "1 Skeniraj · 2 Potvrdi",
      "FORKLIFT TERMINAL · SIMULATION": "TERMINAL VILJUŠKARA · SIMULACIJA",
      "[SCANNER]": "[SKENER]",
      English: "English",
      "Handheld preferences": "Podešavanja ručnog terminala",
      On: "Uključeno",
      Off: "Isključeno",
      "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.":
        "Pomoći ću vam da podesite mobilne procese u vašem skladištu. Prvo ću vas pitati o vašem poslu, zatim ćemo testirati prijem, skladištenje i komisioniranje na virtuelnom ručnom terminalu. Koristite primer skladišta ili odgovarajte na jedno pitanje u isto vreme.",
      "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.":
        "Koristite General Distribution: uobičajena roba plus jedna stavka mleka sa rokom trajanja, paleti/kartoni/jedinice, skeniranje proizvoda i lokacija, usmereno skladištenje, komisioniranje jedne narudžbine i provere pakovanja.",
      "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.":
        "Ovo su potvrđene činjenice. Podesiću postojeće mobilne procese, a zatim ih testirati uzorcima zaliha. Nijedno aktivno skladište nije povezano.",
      "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.":
        "Koristite talase. Ovaj kratki demo testira jednu narudžbinu unutar toka komisioniranja; ne potvrđuje vaš proces puštanja talasa.",
      "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.":
        "Izabrali ste robu sa kontrolom serijskih brojeva. Ovaj primer vođene distribucije koristi stavku bez serijskih brojeva i ne potvrđuje beleženje serijskih brojeva. Vaš zahtev za serijske brojeve ostaje u sažetku za naknadno praćenje.",
      "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.":
        "Testirajmo prijem RECV-10042. Skenirajte paletu PLT-000184, zatim proizvod. Namerno ćemo probati jedan nepoznat barkod da proverimo oporavak.",
      "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.":
        "Nepoznat barkod je odbijen. Podesio sam jasnu poruku o grešci i ponovni pokušaj da operater može da se oporavi bez kreiranja nepoznatog proizvoda.",
      "Correction applied to this demo configuration. Retry the scan with the expected barcode.":
        "Ispravka je primenjena na ovo demo podešavanje. Ponovo skenirajte sa očekivanim barkodom.",
      "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.":
        "Beleženje roka trajanja je uključeno jer ste potvrdili robu sa rokom trajanja. Datum ostaje uz ovu uzorak zalihu.",
      "Receipt complete. The unknown barcode test now has a clear block-and-retry rule.":
        "Prijem je završen. Test nepoznatog barkoda sada ima jasno pravilo blokiranja i ponovnog pokušaja.",
      "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.":
        "Sada smestite primljenu paletu. Uzorak WMS-a predlaže A-01-02 na osnovu simulirane provere zone skladištenja i kapaciteta. FEFO se odnosi na izbor zaliha prema roku trajanja, a ne na garanciju da je ova lokacija odgovarajuća.",
      "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.":
        "Namerno nepotpuna test varijanta dozvolila je opcionu proveru odredišta. Simulacija je uočila neslaganje. Učinio sam skeniranje odredišta obaveznim i blokirao zamenu predložene lokacije.",
      "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution.":
        "Skladištenje je završeno. Ceo LPN je premešten sa svoje 48 jedinica. Obavezno skeniranje odredišta sprečilo je zamenu lokacije.",
      "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.":
        "Komisionirajmo uzorak narudžbine SO-10428 duž A-01-02 → B-03-01. Pre komisioniranja ispravnog proizvoda testiraćemo pogrešan SKU.",
      "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.":
        "Pogrešan SKU je odbijen. Provera proizvoda je sada obavezna pre završetka komisioniranja. Ovo je podešena kontrola, a ne izmerena tvrdnja o produktivnosti.",
      "First line verified. Continue to B-03-01 for 6 EA of WATER-500.":
        "Prva stavka je potvrđena. Nastavite do B-03-01 za 6 EA proizvoda WATER-500.",
      "Picking complete. Both lines were checked and the sample order is now waiting for Packing.":
        "Komisioniranje je završeno. Obe stavke su proverene, a uzorak narudžbine sada čeka pakovanje.",
      "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.":
        "Sva tri uzorka procesa su prošla. Učinite ručni terminal lakšim za upotrebu: probajte veći tekst, ilustraciju proizvoda ili zvuk greške. Promene se odmah prikazuju.",
      "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.":
        "Sada proverite meni operatera. Sadrži samo Prijem, Skladištenje i Komisioniranje. Administracija, pravila, korisnici i finansijski podaci isključeni su iz ove simulirane uloge.",
      "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.":
        "Podešavanje je prošlo tri uzorka poslovnih scenarija. Nijedno skladište nije aktivirano. Administrator bi pregledao ovaj rezultat pre zasebnog koraka aktivacije. Ostavite svoj poslovni email ako želite da razgovarate o podešavanju sa Quark timom.",
      "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.":
        "Rezultat demoa je potvrđen. Ništa nije postavljeno. Možete ostaviti email da sa Quark timom pregledate naredne korake.",
      "Replaying the same confirmed sample warehouse. No new answers are needed.":
        "Ponovno puštanje istog potvrđenog uzorka skladišta. Nisu potrebni novi odgovori.",
      "First run the controlled error test, then apply the correction and retry.":
        "Prvo pokrenite kontrolisani test greške, zatim primenite ispravku i ponovite pokušaj.",
      "Run the highlighted error test before finishing this demo process.":
        "Pokrenite istaknuti test greške pre završetka ovog demo procesa.",
      "Scan accepted": "Skeniranje prihvaćeno",
      Confirmed: "Potvrđeno",
      "Awaiting scan": "Čeka se skeniranje",
      "Scanned destination": "Skenirano odredište",
      "Demo language": "Jezik demoa",
      "Sending…": "Šalje se…",
      Sent: "Poslato",
      "Your setup was accepted. Thank you — the Quark team will follow up.":
        "Vaše podešavanje je prihvaćeno. Hvala — Quark tim će se javiti.",
      "The request timed out. Please check before resending.":
        "Zahtev je istekao. Proverite pre ponovnog slanja.",
      "AI took too long. Your message is kept; retry or use the guided choices.":
        "AI je predugo trajao. Vaša poruka je sačuvana; pokušajte ponovo ili koristite vođene izbore.",
      "Could not send this setup. Please retry or email hello@quark.build.":
        "Nije moguće poslati ovo podešavanje. Pokušajte ponovo ili pišite na hello@quark.build.",
      Configuration: "Podešavanje",
      "Sample product illustration": "Uzorak ilustracije proizvoda",
      "Terminal session": "Sesija terminala",
      "Terminal view": "Prikaz terminala",
      "Warehouse terminal preview": "Pregled terminala skladišta",
      "Choose a JPEG, PNG or PDF up to 3 MB.":
        "Izaberite JPEG, PNG ili PDF do 3 MB.",
      "Could not read the file.": "Datoteku nije moguće pročitati.",
      "AI is unavailable. Use the guided choices to continue.":
        "AI nije dostupan. Koristite vođene izbore da nastavite.",
      "AI returned an unexpected response. The guided sample is still available.":
        "AI je vratio neočekivan odgovor. Vođeni uzorak je i dalje dostupan.",
      "{count} events": "{count} događaja",
      "Configuration · {count}/3 sample processes":
        "Podešavanje · {count}/3 uzorka procesa",
      "{process} simulation started": "Simulacija {process} je pokrenuta",
      "{process} sample passed": "Uzorak {process} je prošao",
      "Try the {process} task": "Probajte zadatak {process}",
      "Wrong product. Expected {value}.":
        "Pogrešan proizvod. Očekivano: {value}.",
      "Wrong source location. Expected {value}.":
        "Pogrešna izvorna lokacija. Očekivano: {value}.",
      "Wrong pallet. Expected {value}.": "Pogrešna paleta. Očekivano: {value}.",
      "Quantity mismatch. Expected {count} EA.":
        "Neslaganje količine. Očekivano: {count} EA.",
      "Expected: {value}": "Očekivano: {value}",
      "{count} / 48 units scanned": "Skenirano {count} / 48 jedinica",
      "{count} EA": "{count} EA",
      "line {current}/{total}": "stavka {current}/{total}",
      "{count} Case × {units}": "{count} kartona × {units}",
      "Sent only with your next AI message":
        "Šalje se samo uz vašu sledeću AI poruku",
      "{setting}: On": "{setting}: Uključeno",
      "{setting}: Off": "{setting}: Isključeno",
      "Switch the demo to {language}?": "Prebaciti demo na {language}?",
      "Switch language": "Promeni jezik",
      "Keep current language": "Zadrži trenutni jezik",
      "Language switched. Your progress is preserved.":
        "Jezik je promenjen. Vaš napredak je sačuvan.",
      receiving: "prijem",
      putaway: "skladištenje",
      picking: "komisioniranje",
      "Scan or type": "Skenirajte ili unesite",
      Loading: "Učitavanje",
      Received: "Primljeno",
      Blocked: "Blokirano",
      "For this guided sample, I will use the milk example. Your product remains part of the discussion.":
        "Za ovaj vođeni uzorak koristiću primer mleka. Vaš proizvod ostaje deo razgovora.",
      "The assistant can offer to switch the language when you write in another language.":
        "Asistent može predložiti promenu jezika kada pišete na drugom jeziku.",
      "Handheld keyboard": "Tastatura terminala",
      "Device key {value}": "Taster {value}",
      "Sample carton": "Primer kutije",
      "Sample carton illustration": "Ilustracija primera kutije",
    },
    sq: {
      "AI onboarding · guided demo": "AI onboarding · guided demo → Albanian",
      "Local RF simulation": "Local RF simulation",
      "Setup assistant": "Setup assistant",
      "Configure · simulate · improve": "Configure · simulate · improve",
      Activity: "Activity",
      Live: "Live",
      LIVE: "LIVE",
      Chat: "Chat",
      RF: "RF",
      "Message to setup assistant": "Message to setup assistant",
      "Send message": "Send message",
      "Attach warehouse plan": "Attach warehouse plan",
      "Remove plan": "Remove plan",
      "Toggle theme": "Toggle theme",
      "Reset demo": "Reset demo",
      "Collapse chat": "Collapse chat",
      "Show activity": "Show activity",
      "Continue setup chat": "Continue setup chat",
      "Answer or ask Quark AI…": "Answer or ask Quark AI…",
      Privacy: "Privacy",
      "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
        "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.",
      "What do you store?": "What do you store?",
      "Ordinary goods": "Mallra të zakonshme",
      "Goods with expiry dates": "Mallra me data skadimi",
      "Serial-controlled goods": "Mallra me kontroll serial",
      "How are goods handled?": "Si trajtohen mallrat?",
      "Pallets, cases and units": "Paleta, kuti dhe njësi",
      "Cases and units": "Kuti dhe njësi",
      "Do operators scan product barcodes during receiving?":
        "A e skanojnë operatorët barkodin e produktit gjatë pranimit?",
      "Yes, product scan is required": "Po, skanimi i produktit kërkohet",
      "Not consistently yet": "Jo në mënyrë të qëndrueshme ende",
      "How is quantity confirmed?": "Si konfirmohet sasia?",
      "Enter the quantity": "Shkruaj sasinë",
      "Scan each unit": "Skano çdo njësi",
      "Who chooses the putaway location?":
        "Kush zgjedh vendndodhjen e vendosjes?",
      "The WMS suggests a location": "WMS sugjeron një vendndodhje",
      "The operator chooses": "Operatori zgjedh",
      "How do operators pick orders?": "Si i marrin operatorët porositë?",
      "One order at a time": "Një porosi në një kohë",
      "In waves": "Me valë",
      "Do you check the product before packing is completed?":
        "A e kontrolloni produktin para se të përfundojë paketimi?",
      "Yes, product check required": "Po, kërkohet kontroll i produktit",
      "Not currently": "Aktualisht jo",
      "Use General Distribution sample":
        "Përdor shembullin e Shpërndarjes së Përgjithshme",
      "The sample includes one expiry-dated milk line. No serial capture.":
        "Shembulli përfshin një rresht qumështi me data skadimi. Pa regjistrim serial.",
      "Confirmed warehouse facts": "Fakte të konfirmuara të magazinës",
      "Prepare mobile processes →": "Përgatit proceset mobile →",
      "Warehouse model confirmed": "Modeli i magazinës u konfirmua",
      "Operator permissions configured": "Lejet e operatorit u konfiguruan",
      "Receiving example prepared": "Shembulli i pranimit u përgatit",
      "Putaway example prepared": "Shembulli i vendosjes u përgatit",
      "Picking example prepared": "Shembulli i marrjes u përgatit",
      "→ Preparing the virtual handheld":
        "→ Duke përgatitur pajisjen e dorës virtuale",
      Before: "Para",
      After: "Pas",
      "Unknown product barcode": "Barkod produkti i panjohur",
      "No recovery rule": "Pa rregull rikuperimi",
      "Block and offer retry": "Blloko dhe ofro rifillim",
      "Target location scan": "Skanimi i vendndodhjes së synuar",
      "Optional in test variant": "Opsionale në variantin e testit",
      Required: "E detyrueshme",
      "Product check before pick completion":
        "Kontroll produkti para përfundimit të marrjes",
      "Apply correction & retry →": "Zbato korrigjimin dhe provo përsëri →",
      "Apply correction & retry": "Zbato korrigjimin dhe provo përsëri",
      "Test putaway →": "Testo vendosjen →",
      "Test picking →": "Testo marrjen →",
      "Customize the handheld →": "Personalizo pajisjen e dorës →",
      "Make the handheld fit your team":
        "Përshtate pajisjen e dorës me ekipin tënd",
      "Larger text": "Tekst më i madh",
      "Hide extra fields": "Fshih fushat shtesë",
      "Show sample product illustration":
        "Shfaq ilustrimin e produktit shembull",
      "Play an error sound": "Luaj një zë gabimi",
      "Enable short action codes": "Aktivizo kodet e shkurtra të veprimeve",
      "Show why a scan is blocked": "Shfaq pse skanimi është bllokuar",
      "Confirm quantity before completion": "Konfirmo sasinë para përfundimit",
      "Handheld language": "Gjuha e pajisjes së dorës",
      "Action controls and menu headings switch language; sample product identifiers stay unchanged.":
        "Kontrollet e veprimeve dhe titujt e menusë ndërrojnë gjuhën; identifikuesit e produkteve shembull mbeten të pandryshuar.",
      "Check operator permissions →": "Kontrollo lejet e operatorit →",
      "Warehouse Operator": "Operator Magazine",
      "Excluded from the operator role:": "Përjashtuar nga roli i operatorit:",
      Administration: "Administrimi",
      "Policy changes": "Ndryshimet e politikave",
      "User management": "Menaxhimi i përdoruesve",
      "Financial data": "Të dhënat financiare",
      "Unassigned operations": "Operacione të pacaktuara",
      "This checks the simulated menu, not access to a live system.":
        "Kjo kontrollon menynë e simuluar, jo qasjen në një sistem aktiv.",
      "Review onboarding result →":
        "Rishiko rezultatin e konfigurimit fillestar →",
      "Warehouse mobile configuration ready":
        "Konfigurimi mobil i magazinës është gati",
      "Guided demo results · sample warehouse only":
        "Rezultatet e demos së udhëzuar · vetëm magazinë shembull",
      "Receiving — Validated in demo": "Pranimi — I validuar në demo",
      "Putaway — Validated in demo": "Vendosja — E validuar në demo",
      "Picking — Validated in demo": "Marrja — E validuar në demo",
      "Barcode controls — Enabled": "Kontrollet e barkodit — Aktive",
      "Location verification — Required":
        "Verifikimi i vendndodhjes — E kërkuar",
      "Operator permissions — Verified in demo":
        "Lejet e operatorit — Verifikuar në demo",
      "TSD layout — Customized": "Paraqitja e TSD-së — E personalizuar",
      "Business scenarios — 3/3 passed": "Skenarët e biznesit — 3/3 të kaluar",
      "Discuss my setup · leave work email →":
        "Diskuto konfigurimin tim · lër email-in e punës →",
      "Review configuration": "Rishiko konfigurimin",
      "Replay simulation": "Riluaj simulimin",
      "Approve onboarding result":
        "Miratoje rezultatin e konfigurimit fillestar",
      "Demo result acknowledged. No activation was performed.":
        "Rezultati i demos u pranua. Asnjë aktivizim nuk u krye.",
      Receiving: "Pranimi",
      Putaway: "Vendosja",
      Picking: "Marrja",
      "Receiving · Putaway · Picking": "Pranimi · Vendosja · Marrja",
      "Receiving, Putaway, Picking": "Pranimi, Vendosja, Marrja",
      "✓ Receiving · Putaway · Picking": "✓ Pranimi · Vendosja · Marrja",
      "Your mobile processes": "Proceset e tua mobile",
      "Confirm warehouse facts in chat to prepare the sample.":
        "Konfirmo të dhënat e magazinës në chat për të përgatitur shembullin.",
      "Confirm warehouse facts in chat.":
        "Konfirmo të dhënat e magazinës në chat.",
      "Waiting for warehouse facts": "Duke pritur të dhënat e magazinës",
      "Preparing the sample configuration":
        "Duke përgatitur konfigurimin shembull",
      "Discover warehouse": "Zbulo magazinën",
      "Prepare mobile processes": "Përgatit proceset mobile",
      "Customize the handheld": "Personalizo pajisjen e dorës",
      "Check operator access": "Kontrollo qasjen e operatorit",
      "Demo checks complete": "Kontrollet e demos u përfunduan",
      "Demo result acknowledged": "Rezultati i demos u pranua",
      "Review sample result": "Rishiko rezultatin shembull",
      Pallet: "Paleta",
      Product: "Produkti",
      Expected: "E pritshme",
      Contents: "Përmbajtja",
      "Suggested bin": "Vendi i sugjeruar",
      Order: "Porosia",
      Source: "Burimi",
      Quantity: "Sasia",
      "Quantity (EA)": "Sasia (EA)",
      "Expiry date": "Data e skadimit",
      "Scan pallet": "Skano paletën",
      "Scan product": "Skano produktin",
      "Confirm expected quantity": "Konfirmo sasinë e pritshme",
      "Enter expiry date": "Shkruaj datën e skadimit",
      "Complete receipt": "Përfundo pranimin",
      "Scan suggested location": "Skano vendndodhjen e sugjeruar",
      "Confirm putaway": "Konfirmo vendosjen",
      "Scan source location": "Skano vendndodhjen burimore",
      "Confirm pick quantity": "Konfirmo sasinë e marrjes",
      "Confirm pick line": "Konfirmo rreshtin e marrjes",
      "Review the accepted scans and complete this step.":
        "Rishiko skanimet e pranuara dhe përfundo këtë hap.",
      "Sample zone match · free capacity. Target scan verifies the suggested bin.":
        "Zona shembull përputhet · kapacitet i lirë. Skanimi i synuar verifikon vendin e sugjeruar.",
      "Controlled error test": "Testi i gabimit të kontrolluar",
      "Try a wrong barcode before accepting the correct scan.":
        "Provo një barkod të gabuar përpara se të pranosh skanimin e saktë.",
      "Try a wrong bin before accepting the correct scan.":
        "Provo një vend të gabuar përpara se të pranosh skanimin e saktë.",
      "Scan UNKNOWN-999": "Skano UNKNOWN-999",
      "Scan A-02-04": "Skano A-02-04",
      Scan: "Skano",
      Confirm: "Konfirmo",
      "Unknown product barcode. Please retry.":
        "Barkodi i produktit është i panjohur. Provo përsëri.",
      "Wrong location. Expected A-01-02.":
        "Vendndodhje e gabuar. Pritej A-01-02.",
      "Enter a valid future expiry date.":
        "Shkruaj një datë skadimi të vlefshme në të ardhmen.",
      "Task complete": "Detyra u përfundua",
      "Sample checks passed": "Kontrollet e shembullit u kaluan",
      "No live warehouse changes": "Asnjë ndryshim aktiv në magazinë",
      "Review the configuration change in chat":
        "Rishiko ndryshimin e konfigurimit në chat",
      "Live layout preview": "Paraqitje e drejtpërdrejtë",
      "Handheld layout preview": "Pamja paraprake e pajisjes së dorës",
      "Preview only · no stock change":
        "Vetëm pamje paraprake · pa ndryshim stoku",
      "Test error feedback": "Testo reagimin ndaj gabimit",
      "Operator menu": "Menyja e operatorit",
      "Assigned process": "Procesi i caktuar",
      "Only assigned warehouse tasks.":
        "Vetëm detyrat e caktuara të magazinës.",
      "No administration access.": "Pa qasje administrative.",
      "Simulated role · 3 processes": "Rol i simuluar · 3 procese",
      Handheld: "Pajisja dorës",
      Forklift: "Karrocë ngritëse",
      "GUIDED SIMULATION": "SIMULIM I UDHËZUAR",
      "QUARK / GUIDED SIMULATION": "QUARK / SIMULIM I UDHËZUAR",
      "SAMPLE CHECKS PASSED": "KONTROLLET E MOSTRËS KALUAN",
      "WAREHOUSE OPERATOR": "OPERATOR MAGAZINE",
      "Continue on the handheld": "Vazhdo në pajisjen dorës",
      "Use the handheld buttons to try the action yourself. Your accepted actions appear in Activity.":
        "Përdorni butonat e pajisjes dorës për ta provuar vetë veprimin. Veprimet tuaja të pranuara shfaqen te Aktiviteti.",
      Role: "Roli",
      Processes: "Proceset",
      "Target scan": "Skanimi i destinacionit",
      "Product check": "Kontrolli i produktit",
      Activation: "Aktivizimi",
      "Separate administrator step": "Hap i veçantë i administratorit",
      "Quark AI is replying…": "Quark AI po përgjigjet…",
      Stop: "Ndalo",
      "Retry AI": "Provo përsëri AI",
      "Earlier AI reply. Ask again in this language.":
        "Përgjigja e mëparshme e AI. Pyesni përsëri në këtë gjuhë.",
      "Continue with your warehouse setup":
        "Vazhdo me konfigurimin e magazinës tuaj",
      "Send this example to the Quark team. We will follow up about your warehouse.":
        "Dërgojeni këtë shembull ekipit të Quark. Do t'ju kontaktojmë për magazinën tuaj.",
      "Work email": "Email i punës",
      Company: "Kompania",
      "Send my contact details and this demo setup to Quark for follow-up.":
        "Dërgoni të dhënat e kontaktit dhe këtë konfigurim demo te Quark për ndjekje.",
      "Privacy policy": "Politika e privatësisë",
      "Send my setup to Quark →": "Dërgo konfigurimin tim te Quark →",
      Close: "Mbyll",
      "Review sample configuration": "Shiko konfigurimin e mostrës",
      "Configured controls": "Kontrollet e konfiguruara",
      "No production activation or live permissions test.":
        "Pa aktivizim në prodhim ose test të lejeve në kohë reale.",
      "Guided demo started": "Demo e udhëzuar filloi",
      "Sample data · no live warehouse connection":
        "Të dhëna mostër · pa lidhje me magazinë reale",
      "Sample warehouse selected": "U zgjodh magazina mostër",
      "Includes an expiry-dated milk line. No serial numbers.":
        "Përfshin një rresht qumësht me datë skadimi. Pa numra serialë.",
      "Warehouse fact confirmed": "Fakti i magazinës u konfirmua",
      "Configuration started": "Konfigurimi filloi",
      "Existing process templates; no new business logic generated":
        "Shabllone ekzistuese procesi; nuk krijohet logjikë e re biznesi",
      "Use Scan, Confirm and Retry yourself":
        "Përdorni vetë Skano, Konfirmo dhe Provo përsëri",
      "Scan blocked": "Skanimi u bllokua",
      "Configuration correction proposed":
        "U propozua korrigjim i konfigurimit",
      "Correction applied": "Korrigjimi u aplikua",
      "Operator action accepted": "Veprimi i operatorit u pranua",
      "48 EA received": "48 EA të pranuara",
      "48 EA stored at A-01-02": "48 EA të ruajtura te A-01-02",
      "2 lines · 18 EA · sent to Packing":
        "2 rreshta · 18 EA · dërguar te Paketimi",
      "First order line completed": "Rreshti i parë i porosisë u përfundua",
      "12 EA picked": "12 EA të mbledhura",
      "Handheld layout customized": "Paraqitja e pajisjes dorës u personalizua",
      "Operator permissions checked": "Lejet e operatorit u kontrolluan",
      "Only three assigned processes visible":
        "Shfaqen vetëm tre procese të caktuara",
      "No activation or production write": "Pa aktivizim ose shkrim në prodhim",
      "Handheld preference changed": "Preferenca e pajisjes dorës u ndryshua",
      "Error feedback preview": "Pamja paraprake e reagimit të gabimit",
      "Visible feedback always shown; audio only when enabled":
        "Reagimi vizual shfaqet gjithmonë; audio vetëm kur është aktivizuar",
      "AI reply received": "Përgjigja e AI u mor",
      "Explanation and confirmed facts only; no warehouse actions":
        "Vetëm shpjegim dhe fakte të konfirmuara; pa veprime në magazinë",
      "AI reply unavailable": "Përgjigja e AI nuk është e disponueshme",
      "The controlled simulation remains available":
        "Simulimi i kontrolluar mbetet i disponueshëm",
      "Configuration updated": "Konfigurimi u përditësua",
      "Retry the expected barcode": "Provo përsëri barkodin e pritur",
      "48 EA · 2 cases × 24": "48 EA · 2 kuti × 24",
      "12 EA": "12 EA",
      "6 EA": "6 EA",
      "one unit": "një njësi",
      SCANNER: "SKANERI",
      "Demo sections": "Seksionet e demos",
      "Activity and events": "Aktiviteti dhe ngjarjet",
      "Configuration details": "Detajet e konfigurimit",
      "Waiting for setup": "Në pritje të konfigurimit",
      "Configuration · waiting for facts": "Konfigurimi · në pritje të fakteve",
      "SCANNED DESTINATION": "DESTINACIONI I SKANUAR",
      "Quantity confirmation": "Konfirmimi i sasisë",
      Optional: "Opsionale",
      "Action codes": "Kodet e veprimeve",
      "1 Scan · 2 Confirm": "1 Skano · 2 Konfirmo",
      "FORKLIFT TERMINAL · SIMULATION":
        "TERMINALI I KARROCËS NGRITËSE · SIMULIM",
      "[SCANNER]": "[SCANNER]",
      English: "Anglisht",
      "Handheld preferences": "Preferencat e pajisjes dore",
      On: "Ndezur",
      Off: "Fikur",
      "I will help configure your warehouse’s mobile processes. First I will ask about your work, then we will test receiving, putaway and picking on a virtual handheld. Use the sample warehouse or answer one question at a time.":
        "Do t'ju ndihmoj të konfiguroni proceset e mobile të magazinës suaj. Së pari do t'ju pyes për punën tuaj, pastaj do të testojmë pranimin, vendosjen dhe marrjen në një pajisje dore virtuale. Përdorni magazinën e mostrës ose përgjigjuni një pyetjeje në një kohë.",
      "Use General Distribution: ordinary goods plus one expiry-dated milk line, pallets/cases/units, product and bin scanning, directed putaway, single-order picking and packing checks.":
        "Përdor Shpërndarjen e Përgjithshme: mallra të zakonshme plus një rresht qumështi me datë skadimi, paleta/arka/njësi, skanim produkti dhe vendi, vendosje e drejtuar, marrje e një porosie dhe kontrolle paketimi.",
      "These are confirmed facts. I will configure existing mobile processes, then test them with sample stock. No live warehouse is connected.":
        "Këto janë fakte të konfirmuara. Do të konfiguroj proceset e mobile ekzistuese, pastaj do t'i testoj me stok mostër. Asnjë magazinë reale nuk është e lidhur.",
      "You use waves. This short demo tests one order inside the picking flow; it does not validate your wave-release process.":
        "Ju përdorni valë. Ky demo i shkurtër teston një porosi brenda rrjedhës së marrjes; nuk e validon procesin tuaj të lëshimit të valëve.",
      "You selected serial-controlled goods. This guided distribution example uses a non-serial line and does not validate serial capture. Your serial requirement remains in the summary for follow-up.":
        "Ju zgjodhët mallra me kontroll serial. Ky shembull i udhëzuar i shpërndarjes përdor një rresht jo-serial dhe nuk validon regjistrimin serial. Kërkesa juaj serike mbetet në përmbledhje për ndjekje.",
      "Let’s test receiving RECV-10042. Scan pallet PLT-000184, then the product. We will deliberately try one unknown barcode to check recovery.":
        "Le të testojmë pranimin RECV-10042. Skanoni paletën PLT-000184, pastaj produktin. Do të provojmë qëllimisht një barkod të panjohur për të kontrolluar rikuperimin.",
      "The unknown barcode was rejected. I configured a clear error and retry so the operator can recover without creating an unknown product.":
        "Barkodi i panjohur u refuzua. Kam konfiguruar një gabim të qartë dhe rikthim, që operatori të mund të rikuperojë pa krijuar një produkt të panjohur.",
      "Correction applied to this demo configuration. Retry the scan with the expected barcode.":
        "Korrigjimi u aplikua në këtë konfigurim demo. Riprovoni skanimin me barkodin e pritur.",
      "Expiry capture is enabled because you confirmed expiry-dated goods. The date stays with this sample stock.":
        "Regjistrimi i datës së skadimit është aktivizuar sepse konfirmuat mallra me datë skadimi. Data mbetet me këtë stok mostër.",
      "Receipt complete. The unknown barcode test now has a clear block-and-retry rule.":
        "Pranimi u përfundua. Testi i barkodit të panjohur ka tani një rregull të qartë bllokimi dhe rikthimi.",
      "Now place the received pallet. The sample WMS suggests A-01-02 using a simulated storage-zone and capacity check. FEFO concerns stock selection by expiry, not a guarantee that this bin is suitable.":
        "Tani vendosni paletën e pranuar. Sistemi WMS i mostrës sugjeron A-01-02 duke përdorur një kontroll të simuluar të zonës së magazinimit dhe kapacitetit. FEFO lidhet me zgjedhjen e stokut sipas skadimit, jo me garancinë që ky vend është i përshtatshëm.",
      "The deliberately incomplete test variant allowed an optional target check. The simulation caught the mismatch. I made the target scan mandatory and blocked substitution of the suggested bin.":
        "Varianti i testit qëllimisht të paplotë lejoi një kontroll opsional të destinacionit. Simulimi zbuloi mospërputhjen. E bëra skanimin e destinacionit të detyrueshëm dhe bllokova zëvendësimin e vendit të sugjeruar.",
      "Putaway complete. The entire LPN moved with its 48 units. The required target scan prevented a bin substitution.":
        "Vendosja u përfundua. E gjithë LPN u zhvendos me 48 njësitë e saj. Skanimi i detyrueshëm i destinacionit parandaloi zëvendësimin e vendit.",
      "Let’s pick sample order SO-10428 along A-01-02 → B-03-01. We will test a wrong SKU before picking the correct product.":
        "Le të marrim porosinë mostër SO-10428 përgjatë A-01-02 → B-03-01. Do të testojmë një SKU të gabuar përpara se të marrim produktin e saktë.",
      "The wrong SKU was rejected. Product verification is now required before completing a pick. This is a configured control, not a measured productivity claim.":
        "SKU i gabuar u refuzua. Verifikimi i produktit kërkohet tani përpara përfundimit të një marrjeje. Kjo është një kontroll i konfiguruar, jo një pretendim i matur produktiviteti.",
      "First line verified. Continue to B-03-01 for 6 EA of WATER-500.":
        "Rreshti i parë u verifikua. Vazhdoni në B-03-01 për 6 EA të WATER-500.",
      "Picking complete. Both lines were checked and the sample order is now waiting for Packing.":
        "Marrja u përfundua. Të dy rreshtat u kontrolluan dhe porosia mostër është tani në pritje për Paketim.",
      "All three sample processes passed. Make the handheld easier to use: try larger text, a product illustration or an error sound. Changes appear immediately.":
        "Të tre proceset mostër kaluan. Ta bëjmë pajisjen dore më të lehtë për përdorim: provoni tekst më të madh, një ilustrim produkti ose një zë gabimi. Ndryshimet shfaqen menjëherë.",
      "Now check the operator menu. It contains only Receiving, Putaway and Picking. Administration, policies, users and financial data are excluded from this simulated role.":
        "Tani kontrolloni menunë e operatorit. Ai përmban vetëm Pranimin, Vendosjen dhe Marrjen. Administrimi, politikat, përdoruesit dhe të dhënat financiare përjashtohen nga ky rol i simuluar.",
      "The configuration passed three sample business scenarios. No warehouse was activated. An administrator would review this result before a separate activation step. Leave your work email if you would like to discuss the setup with Quark.":
        "Konfigurimi kaloi tre skenarë mostër biznesi. Asnjë magazinë nuk u aktivizua. Një administrator do ta rishikonte këtë rezultat para një hapi të veçantë aktivizimi. Lini emailin tuaj të punës nëse dëshironi të diskutoni konfigurimin me Quark.",
      "Demo result acknowledged. Nothing was deployed. You can leave your email to review the next steps with the Quark team.":
        "Rezultati i demos u pranua. Asgjë nuk u vendos. Mund të lini emailin tuaj për të rishikuar hapat e ardhshëm me ekipin e Quark.",
      "Replaying the same confirmed sample warehouse. No new answers are needed.":
        "Po riluajmë të njëjtën magazinë mostër të konfirmuar. Nuk nevojiten përgjigje të reja.",
      "First run the controlled error test, then apply the correction and retry.":
        "Së pari kryeni testin e kontrolluar të gabimit, pastaj aplikoni korrigjimin dhe riprovoni.",
      "Run the highlighted error test before finishing this demo process.":
        "Kryeni testin e theksuar të gabimit përpara se të përfundoni këtë proces demo.",
      "Scan accepted": "Skanimi u pranua",
      Confirmed: "Konfirmuar",
      "Awaiting scan": "Në pritje të skanimit",
      "Scanned destination": "Destinacioni i skanuar",
      "Demo language": "Gjuha e demos",
      "Sending…": "Duke dërguar…",
      Sent: "Dërguar",
      "Your setup was accepted. Thank you — the Quark team will follow up.":
        "Konfigurimi juaj u pranua. Faleminderit — ekipi i Quark do t'ju kontaktojë.",
      "The request timed out. Please check before resending.":
        "Kërkesa skadoi. Ju lutemi kontrolloni përpara se ta dërgoni përsëri.",
      "AI took too long. Your message is kept; retry or use the guided choices.":
        "AI kërkoi shumë kohë. Mesazhi juaj mbahet; riprovoni ose përdorni zgjedhjet e udhëzuara.",
      "Could not send this setup. Please retry or email hello@quark.build.":
        "Ky konfigurim nuk mund të dërgohet. Ju lutemi riprovoni ose na shkruani te hello@quark.build.",
      Configuration: "Konfigurimi",
      "Sample product illustration": "Ilustrim mostër i produktit",
      "Terminal session": "Sesioni i terminalit",
      "Terminal view": "Pamja e terminalit",
      "Warehouse terminal preview": "Pamja paraprake e terminalit të magazinës",
      "Choose a JPEG, PNG or PDF up to 3 MB.":
        "Zgjidhni një JPEG, PNG ose PDF deri në 3 MB.",
      "Could not read the file.": "Skedari nuk mund të lexohet.",
      "AI is unavailable. Use the guided choices to continue.":
        "AI nuk është e disponueshme. Përdorni zgjedhjet e udhëzuara për të vazhduar.",
      "AI returned an unexpected response. The guided sample is still available.":
        "AIktheu një përgjigje të papritur. Mostra e udhëzuar është ende e disponueshme.",
      "{count} events": "{count} ngjarje",
      "Configuration · {count}/3 sample processes":
        "Konfigurimi · {count}/3 procese mostër",
      "{process} simulation started": "Simulimi i {process} filloi",
      "{process} sample passed": "{process} mostër kaloi",
      "Try the {process} task": "Provo detyrën {process}",
      "Wrong product. Expected {value}.": "Produkt i gabuar. Pritej {value}.",
      "Wrong source location. Expected {value}.":
        "Vendndodhje burimi e gabuar. Pritej {value}.",
      "Wrong pallet. Expected {value}.": "Paletë e gabuar. Pritej {value}.",
      "Quantity mismatch. Expected {count} EA.":
        "Mospërputhje sasie. Pritej {count} EA.",
      "Expected: {value}": "Pritej: {value}",
      "{count} / 48 units scanned": "{count} / 48 njësi të skanuara",
      "{count} EA": "{count} EA",
      "line {current}/{total}": "rreshti {current}/{total}",
      "{count} Case × {units}": "{count} Arkë × {units}",
      "Sent only with your next AI message":
        "Dërgohet vetëm me mesazhin tuaj të ardhshëm në AI",
      "{setting}: On": "{setting}: Ndezur",
      "{setting}: Off": "{setting}: Fikur",
      "Switch the demo to {language}?": "Të ndryshohet demo në {language}?",
      "Switch language": "Ndrysho gjuhën",
      "Keep current language": "Mbaj gjuhën aktuale",
      "Language switched. Your progress is preserved.":
        "Gjuha u ndryshua. Progresi juaj u ruajt.",
      receiving: "pranimi",
      putaway: "vendosja",
      picking: "marrja",
      "Scan or type": "Skanoni ose shkruani",
      Loading: "Duke u ngarkuar",
      Received: "Pranuar",
      Blocked: "Bllokuar",
      "For this guided sample, I will use the milk example. Your product remains part of the discussion.":
        "Për këtë mostër të udhëzuar, do të përdor shembullin e qumështit. Produkti juaj mbetet pjesë e diskutimit.",
      "The assistant can offer to switch the language when you write in another language.":
        "Asistenti mund të propozojë ndryshimin e gjuhës kur shkruani në një gjuhë tjetër.",
      "Handheld keyboard": "Tastiera e terminalit",
      "Device key {value}": "Tasti {value}",
      "Sample carton": "Kuti shembull",
      "Sample carton illustration": "Ilustrim i kutisë shembull",
    },
  };
  const extra = {
    bg: "Следващото сканиране умишлено ще провери грешен баркод.",
    ro: "Următoarea scanare va testa în mod intenționat un cod de bare incorect.",
    el: "Η επόμενη σάρωση θα ελέγξει σκόπιμα έναν λανθασμένο γραμμωτό κώδικα.",
    sr: "Sledeće skeniranje namerno proverava pogrešan barkod.",
    sq: "Skanimi i radhës do të provojë qëllimisht një barkod të pasaktë.",
  };
  for (const [lang, value] of Object.entries(extra))
    catalogs[lang]["The next Scan deliberately tests an incorrect barcode."] =
      value;
  Object.assign(catalogs.sq, {
    "Local RF simulation": "Simulim lokal i terminalit RF",
    "Setup assistant": "Asistenti i konfigurimit",
    "Configure · simulate · improve": "Konfiguro · simulo · përmirëso",
    Activity: "Aktiviteti",
    Live: "Drejtpërdrejt",
    LIVE: "DREJTPËRDREJT",
    Chat: "Biseda",
    "Message to setup assistant": "Mesazh për asistentin e konfigurimit",
    "Send message": "Dërgo mesazhin",
    "Attach warehouse plan": "Bashkëngjit planin e magazinës",
    "Remove plan": "Hiq planin",
    "Toggle theme": "Ndrysho temën",
    "Reset demo": "Nis demonstrimin nga e para",
    "Collapse chat": "Palos bisedën",
    "Show activity": "Shfaq aktivitetin",
    "Continue setup chat": "Vazhdo bisedën e konfigurimit",
    "Answer or ask Quark AI…": "Përgjigju ose pyet Quark AI…",
    Privacy: "Privatësia",
    "Only messages you send and selected files go to Quark AI. Guided choices and RF actions stay in this page.":
      "Vetëm mesazhet që dërgoni dhe skedarët e zgjedhur dërgohen te Quark AI. Zgjedhjet e udhëzuara dhe veprimet RF mbeten në këtë faqe.",
    "What do you store?": "Çfarë ruani në magazinë?",
  });
  Object.assign(catalogs.ro, {
    Live: "În direct",
    LIVE: "ÎN DIRECT",
    Chat: "Conversație",
  });
  catalogs.el["AI onboarding · guided demo"] =
    "Ρύθμιση με AI · διαδραστική επίδειξη";
  for (const key of Object.keys(catalogs.el))
    catalogs.el[key] = catalogs.el[key]
      .replaceAll("Λήψη παραγγελίας", "Συλλογή")
      .replaceAll("λήψη παραγγελίας", "συλλογή")
      .replaceAll("mobile", "κινητές");
  catalogs.sq["AI onboarding · guided demo"] =
    "Konfigurim me AI · demonstrim i udhëzuar";
  for (const key of Object.keys(catalogs.sq))
    catalogs.sq[key] = catalogs.sq[key].replaceAll(
      "proceset e mobile",
      "proceset në terminalin portativ",
    );
  Object.assign(catalogs.bg, {
    "Lot policy": "Политика за партиди",
    "Lot creation": "Създаване на партида",
    "Receiving lot attributes": "Атрибути на партидата при приемане",
    "Required at receiving": "Задължителни при приемане",
    Existing: "Съществуваща партида",
    Attributes: "Атрибути",
    "Capture attributes during receiving": "Въвеждане на атрибути при приемане",
    "LPN entry": "Въвеждане на LPN",
    "Receiving unit": "Единица за приемане",
    "Whole pallets": "Цели палети",
    "Receiving location": "Място за приемане",
    "Receiving location scan": "Сканиране на мястото за приемане",
    "Not required": "Не се изисква",
    "Product barcode": "Баркод на продукта",
    "Attribute value is required.": "Въведете стойност на атрибута.",
  });
  Object.assign(catalogs.ro, {
    "Lot policy": "Politică de lot",
    "Lot creation": "Crearea lotului",
    "Receiving lot attributes": "Atribute de lot la recepție",
    "Required at receiving": "Obligatorii la recepție",
    Existing: "Lot existent",
    Attributes: "Atribute",
    "Capture attributes during receiving": "Introducerea atributelor la recepție",
    "LPN entry": "Introducere LPN",
    "Receiving unit": "Unitate de recepție",
    "Whole pallets": "Paleți întregi",
    "Receiving location": "Locație de recepție",
    "Receiving location scan": "Scanarea locației de recepție",
    "Not required": "Nu este necesară",
    "Product barcode": "Cod de bare produs",
    "Attribute value is required.": "Introduceți valoarea atributului.",
  });
  Object.assign(catalogs.el, {
    "Lot policy": "Πολιτική παρτίδας",
    "Lot creation": "Δημιουργία παρτίδας",
    "Receiving lot attributes": "Χαρακτηριστικά παρτίδας στην παραλαβή",
    "Required at receiving": "Υποχρεωτικά στην παραλαβή",
    Existing: "Υπάρχουσα παρτίδα",
    Attributes: "Χαρακτηριστικά",
    "Capture attributes during receiving": "Καταχώριση χαρακτηριστικών κατά την παραλαβή",
    "LPN entry": "Εισαγωγή LPN",
    "Receiving unit": "Μονάδα παραλαβής",
    "Whole pallets": "Ολόκληρες παλέτες",
    "Receiving location": "Θέση παραλαβής",
    "Receiving location scan": "Σάρωση θέσης παραλαβής",
    "Not required": "Δεν απαιτείται",
    "Product barcode": "Γραμμωτός κώδικας προϊόντος",
    "Attribute value is required.": "Απαιτείται τιμή χαρακτηριστικού.",
  });
  Object.assign(catalogs.sr, {
    "Lot policy": "Politika lota",
    "Lot creation": "Kreiranje lota",
    "Receiving lot attributes": "Atributi lota pri prijemu",
    "Required at receiving": "Obavezni pri prijemu",
    Existing: "Postojeći lot",
    Attributes: "Atributi",
    "Capture attributes during receiving": "Unos atributa pri prijemu",
    "LPN entry": "Unos LPN-a",
    "Receiving unit": "Jedinica prijema",
    "Whole pallets": "Cele palete",
    "Receiving location": "Lokacija prijema",
    "Receiving location scan": "Skeniranje lokacije prijema",
    "Not required": "Nije potrebno",
    "Product barcode": "Barkod proizvoda",
    "Attribute value is required.": "Unesite vrednost atributa.",
  });
  Object.assign(catalogs.sq, {
    "Lot policy": "Politika e lotit",
    "Lot creation": "Krijimi i lotit",
    "Receiving lot attributes": "Atributet e lotit gjatë pranimit",
    "Required at receiving": "Të detyrueshme gjatë pranimit",
    Existing: "Lot ekzistues",
    Attributes: "Atributet",
    "Capture attributes during receiving": "Futja e atributeve gjatë pranimit",
    "LPN entry": "Futja e LPN-së",
    "Receiving unit": "Njësia e pranimit",
    "Whole pallets": "Paleta të plota",
    "Receiving location": "Vendndodhja e pranimit",
    "Receiving location scan": "Skanimi i vendndodhjes së pranimit",
    "Not required": "Nuk kërkohet",
    "Product barcode": "Barkodi i produktit",
    "Attribute value is required.": "Vendosni vlerën e atributit.",
  });
  if (typeof module === "object" && module.exports) module.exports = catalogs;
  else root.QuarkOnboardingCatalogs = catalogs;
})(typeof window === "object" ? window : this);
