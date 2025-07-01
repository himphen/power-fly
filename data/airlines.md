好的，這是一份關於您提供的 JSON 結構中每個鍵值的詳細說明文件，以 Markdown 格式呈現。

---

# JSON 結構說明 (JSON Structure Documentation)

本文件旨在詳細解釋用於儲存航空公司流動電源（Power Bank）規定的 JSON 數據結構中，每一個鍵（key）的用途和含義。

## 第一層：根物件 (Root Object)

這是 JSON 檔案的最外層結構。

- **`schemaVersion`** (`String`)
  - **EN:** The version number of this JSON schema. This helps in managing changes and ensuring compatibility if the structure evolves over time.
  - **ZH:** 此 JSON 結構的版本號。如果將來結構發生變化，這有助於版本管理並確保兼容性。

- **`lastUpdated`** (`String`)
  - **EN:** The date (in YYYY-MM-DD format) when the data in this file was last updated or verified.
  - **ZH:** 此檔案中的數據最後更新或驗證的日期（格式為 YYYY-MM-DD）。

- **`notes_zh`** (`String`)
  - **EN:** General notes or disclaimers applicable to all airlines in Traditional Chinese. This typically includes overarching regulations from authorities like the Hong Kong CAD.
  - **ZH:** 適用於所有航空公司的通用備註或免責聲明（繁體中文）。這通常包含來自香港民航處等機構的總體規定。

- **`notes_en`** (`String`)
  - **EN:** The English version of the general notes or disclaimers.
  - **ZH:** 通用備註或免責聲明的英文版本。

- **`airlines`** (`Array`)
  - **EN:** An array of objects, where each object represents a single airline and contains its specific details and regulations.
  - **ZH:** 一個物件陣列，其中每個物件代表一家航空公司，並包含其詳細資訊和相關規定。

---

## 第二層：航空公司物件 (`airlines` Array Object)

`airlines` 陣列中的每個物件都包含以下鍵值：

- **`id`** (`String`)
  - **EN:** A unique, human-readable identifier for the airline, typically in lowercase and using hyphens for spaces (e.g., "cathay-pacific").
  - **ZH:** 航空公司的唯一標識符，通常為小寫，並用連字符（-）代替空格（例如 "cathay-pacific"）。

- **`name_en`** (`String`)
  - **EN:** The official English name of the airline.
  - **ZH:** 航空公司的官方英文名稱。

- **`name_zh`** (`String`)
  - **EN:** The official Traditional Chinese name of the airline.
  - **ZH:** 航空公司的官方中文（繁體）名稱。

- **`iata_code`** (`String`)
  - **EN:** The two-character IATA (International Air Transport Association) code for the airline (e.g., "CX").
  - **ZH:** 航空公司的雙字母 IATA（國際航空運輸協會）代碼（例如 "CX"）。

- **`source_url_en`** (`String`)
  - **EN:** The direct URL to the airline's official regulations page in English where this information was sourced.
  - **ZH:** 該資訊來源的航空公司官方規定頁面的英文版網址。

- **`source_url_zh`** (`String`)
  - **EN:** The direct URL to the airline's official regulations page in Traditional Chinese. If a specific Chinese page is not available, this may be the same as `source_url_en`.
  - **ZH:** 該資訊來源的航空公司官方規定頁面的中文版網址。如果沒有特定的中文頁面，此網址可能與 `source_url_en` 相同。

- **`regulations`** (`Object`)
  - **EN:** An object containing the detailed set of rules for this specific airline.
  - **ZH:** 一個包含該航空公司詳細規則的物件。

---

## 第三層：規定物件 (`regulations` Object)

`regulations` 物件包含具體的規則細項：

- **`carry_on_only`** (`Boolean`)
  - **EN:** `true` if power banks are only allowed in carry-on baggage and forbidden in checked baggage.
  - **ZH:** 如果流動電源只允許放在手提行李中，並禁止放入寄艙行李，則為 `true`。

- **`in_flight_use_prohibited`** (`Boolean`)
  - **EN:** `true` if using the power bank (e.g., for charging other devices) during the flight is prohibited.
  - **ZH:** 如果在飛行途中禁止使用流動電源（例如為其他設備充電），則為 `true`。

- **`in_flight_charging_prohibited`** (`Boolean`)
  - **EN:** `true` if charging the power bank itself during the flight is prohibited. This is often the same as `in_flight_use_prohibited`.
  - **ZH:** 如果在飛行途中禁止為流動電源本身充電，則為 `true`。這通常與 `in_flight_use_prohibited` 相同。

- **`overhead_stowage_prohibited`** (`Boolean`)
  - **EN:** `true` if storing the power bank in the overhead compartment is prohibited.
  - **ZH:** 如果禁止將流動電源存放在頭頂行李架中，則為 `true`。

- **`under_seat_stowage_required`** (`Boolean`)
  - **EN:** `true` if the power bank must be stored under the seat in front of the passenger.
  - **ZH:** 如果流動電源必須存放在前方座位底下，則為 `true`。

- **`unmarked_prohibited`** (`Boolean`)
  - **EN:** `true` if power banks without clear capacity markings (e.g., Wh or mAh/V) are prohibited.
  - **ZH:** 如果沒有清晰容量標示（例如 Wh 或 mAh/V）的流動電源被禁止攜帶，則為 `true`。

- **`protection_required`** (`Boolean`)
  - **EN:** `true` if the power bank's terminals must be protected against short-circuiting (e.g., in original packaging or a separate bag).
  - **ZH:** 如果流動電源的電極必須被保護以防止短路（例如，放在原包裝或獨立膠袋中），則為 `true`。

- **`capacity`** (`Array`)
  - **EN:** An array of objects, where each object defines the rules for a specific capacity tier (e.g., one object for ≤100Wh, another for 101-160Wh).
  - **ZH:** 一個物件陣列，其中每個物件定義了特定容量等級的規則（例如，一個物件用於 ≤100Wh，另一個用於 101-160Wh）。

- **`summary_en`** (`String`)
  - **EN:** A concise, human-readable summary of the most important rules for this airline in English.
  - **ZH:** 針對該航空公司最重要規則的簡明英文摘要。

- **`summary_zh`** (`String`)
  - **EN:** The Traditional Chinese version of the summary.
  - **ZH:** 簡明摘要的繁體中文版本。

---

## 第四層：容量物件 (`capacity` Array Object)

`capacity` 陣列中的每個物件都包含以下鍵值：

- **`min_wh`** (`Number`, Optional)
  - **EN:** The minimum Watt-hour (Wh) value for this rule tier. This key is typically used for tiers above 100Wh (e.g., 100.01).
  - **ZH:** 此規則等級的最小瓦時（Wh）值。此鍵通常用於高於 100Wh 的等級（例如 100.01）。

- **`max_wh`** (`Number`)
  - **EN:** The maximum Watt-hour (Wh) value for this rule tier.
  - **ZH:** 此規則等級的最大瓦時（Wh）值。

- **`quantity_limit`** (`Number` or `null`)
  - **EN:** The maximum number of power banks allowed within this capacity tier. `null` if the airline specifies "a reasonable amount" without a hard limit.
  - **ZH:** 在此容量等級下允許攜帶的流動電源最大數量。如果航空公司規定為「合理數量」而沒有硬性限制，則為 `null`。

- **`approval_required`** (`Boolean`)
  - **EN:** `true` if pre-approval from the airline is required to carry power banks in this capacity tier.
  - **ZH:** 如果攜帶此容量等級的流動電源需要事先獲得航空公司批准，則為 `true`。

- **`notes_en`** (`String`)
  - **EN:** Additional English notes specific to this capacity tier, such as "per passenger" or other clarifications.
  - **ZH:** 針對此容量等級的額外英文備註，例如「每位乘客」或其他說明。

- **`notes_zh`** (`String`)
  - **EN:** The Traditional Chinese version of the notes for this capacity tier.
  - **ZH:** 針對此容量等級備註的繁體中文版本。