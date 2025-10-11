#!/usr/bin/env python3
"""
Generate all Grade 6 unit JSON and HTML files
This script creates complete JSON data files and HTML game pages for Grade 6 units 4-12 and Reviews 1-3
"""

import json
import os

# Unit configurations
UNITS_CONFIG = [
    {
        "id": "g6-unit-4-my-neighbourhood",
        "title": "Unit 4: My Neighbourhood - Comparative Adjectives & Directions",
        "subtitle": "Comparative Adjectives & Directions",
        "grammar_topics": ["Comparative Adjectives", "Giving Directions", "Neighbourhood Vocabulary"],
        "theory_brief": "So sánh hơn (Comparative) dùng để so sánh 2 người/vật. Tính từ ngắn (1 âm tiết): thêm -er (bigger, taller). Tính từ dài (2+ âm tiết): more + tính từ (more beautiful, more expensive). Cấu trúc: A + be + adj-er/more adj + than + B. Chỉ đường: Go straight (đi thẳng), Turn left/right (rẽ trái/phải), Take the first/second turning (rẽ ở ngã rẽ thứ nhất/hai).",
        "theory_examples": [
            "My house is bigger than your house. (Nhà tôi lớn hơn nhà bạn.)",
            "This street is more modern than that street. (Đường này hiện đại hơn đường kia.)",
            "Go straight, then turn left. (Đi thẳng, sau đó rẽ trái.)",
            "Take the second turning on the right. (Rẽ phải ở ngã rẽ thứ hai.)"
        ]
    },
    {
        "id": "g6-unit-5-natural-wonders",
        "title": "Unit 5: Natural Wonders - Must/Mustn't & Superlatives",
        "subtitle": "Must/Mustn't & Superlative Adjectives",
        "grammar_topics": ["Must/Mustn't", "Superlative Adjectives", "Natural Features Vocabulary"],
        "theory_brief": "Must/mustn't dùng để diễn tả sự bắt buộc hoặc cấm đoán. Must + V: phải làm gì. Mustn't + V: không được làm gì. So sánh nhất (Superlative) dùng cho 3+ người/vật. Tính từ ngắn: the + adj-est (the biggest, the tallest). Tính từ dài: the most + adj (the most beautiful, the most expensive).",
        "theory_examples": [
            "You must do your homework. (Bạn phải làm bài tập.)",
            "You mustn't talk in the library. (Bạn không được nói chuyện trong thư viện.)",
            "Mount Everest is the highest mountain in the world. (Everest là núi cao nhất thế giới.)",
            "This is the most beautiful place I've ever seen. (Đây là nơi đẹp nhất tôi từng thấy.)"
        ]
    },
    {
        "id": "g6-unit-6-our-tet-holiday",
        "title": "Unit 6: Our Tet Holiday - Will/Won't & Should/Shouldn't",
        "subtitle": "Will/Won't for Future & Should/Shouldn't",
        "grammar_topics": ["Will/Won't", "Should/Shouldn't", "Tet Holiday Vocabulary"],
        "theory_brief": "Will/won't dùng để nói về tương lai, dự đoán. Will + V: sẽ làm gì. Won't + V: sẽ không làm gì. Should/shouldn't dùng để đưa ra lời khuyên. Should + V: nên làm gì. Shouldn't + V: không nên làm gì. Tet là dịp quan trọng của Việt Nam.",
        "theory_examples": [
            "We will visit our grandparents at Tet. (Chúng tôi sẽ thăm ông bà vào Tết.)",
            "It won't rain tomorrow. (Trời sẽ không mưa ngày mai.)",
            "You should study hard. (Bạn nên học chăm chỉ.)",
            "You shouldn't eat too much candy. (Bạn không nên ăn quá nhiều kẹo.)"
        ]
    },
    {
        "id": "g6-unit-7-television",
        "title": "Unit 7: Television - Conjunctions & Question Words",
        "subtitle": "Conjunctions & Wh-Questions",
        "grammar_topics": ["Conjunctions", "Question Words", "Television Vocabulary"],
        "theory_brief": "Liên từ (Conjunctions) nối các câu: and (và), but (nhưng), so (vì vậy), because (bởi vì), although (mặc dù). Từ hỏi (Question words): What (cái gì), Where (ở đâu), When (khi nào), Who (ai), Why (tại sao), How (như thế nào).",
        "theory_examples": [
            "I like watching TV and reading books. (Tôi thích xem TV và đọc sách.)",
            "She is tired but she still studies. (Cô ấy mệt nhưng vẫn học.)",
            "It rained, so we stayed home. (Trời mưa, vì vậy chúng tôi ở nhà.)",
            "What is your favourite TV programme? (Chương trình TV yêu thích của bạn là gì?)"
        ]
    },
    {
        "id": "g6-unit-8-sports-and-games",
        "title": "Unit 8: Sports and Games - Past Simple Tense",
        "subtitle": "Past Simple Tense",
        "grammar_topics": ["Past Simple", "Regular Verbs", "Irregular Verbs"],
        "theory_brief": "Thì Quá Khứ Đơn (Past Simple) diễn tả hành động đã xảy ra và kết thúc trong quá khứ. Công thức: (+) S + V-ed/V2, (-) S + didn't + V0, (?) Did + S + V0? Động từ có quy tắc thêm -ed (played, watched). Động từ bất quy tắc học thuộc (went, saw, did).",
        "theory_examples": [
            "I played football yesterday. (Tôi đã chơi bóng đá hôm qua.)",
            "She went to the gym last week. (Cô ấy đã đi phòng gym tuần trước.)",
            "They didn't watch TV last night. (Họ không xem TV tối qua.)",
            "Did you play badminton? (Bạn có chơi cầu lông không?)"
        ]
    },
    {
        "id": "g6-unit-9-cities-of-the-world",
        "title": "Unit 9: Cities of the World - Superlatives & Present Perfect",
        "subtitle": "Superlatives & Present Perfect",
        "grammar_topics": ["Superlative Adjectives", "Present Perfect", "World Cities Vocabulary"],
        "theory_brief": "So sánh nhất (Superlative): the + adj-est / the most + adj. Thì Hiện Tại Hoàn Thành (Present Perfect): have/has + V3/V-ed. Dùng để nói về trải nghiệm đã từng làm. Have/has been to: đã từng đến (địa điểm).",
        "theory_examples": [
            "Tokyo is the most crowded city in the world. (Tokyo là thành phố đông đúc nhất thế giới.)",
            "I have been to Paris. (Tôi đã từng đến Paris.)",
            "She has visited London. (Cô ấy đã thăm London.)",
            "This is the best hotel in the city. (Đây là khách sạn tốt nhất thành phố.)"
        ]
    },
    {
        "id": "g6-unit-10-our-houses-in-the-future",
        "title": "Unit 10: Our Houses in the Future - Will & Might",
        "subtitle": "Will for Predictions & Might",
        "grammar_topics": ["Will for Future", "Might for Possibility", "Future House Vocabulary"],
        "theory_brief": "Will + V: sẽ làm gì (dự đoán chắc chắn về tương lai). Might + V: có thể sẽ làm gì (khả năng, không chắc chắn). Dùng để nói về nhà ở tương lai với công nghệ hiện đại.",
        "theory_examples": [
            "Future houses will have robots. (Nhà tương lai sẽ có robot.)",
            "We will live in smart homes. (Chúng ta sẽ sống trong nhà thông minh.)",
            "It might rain tomorrow. (Trời có thể sẽ mưa ngày mai.)",
            "They might travel to space. (Họ có thể sẽ du hành vũ trụ.)"
        ]
    },
    {
        "id": "g6-unit-11-our-greener-world",
        "title": "Unit 11: Our Greener World - Conditional Type 1",
        "subtitle": "First Conditional (If + present, will)",
        "grammar_topics": ["Conditional Type 1", "Environmental Vocabulary", "3Rs: Reduce, Reuse, Recycle"],
        "theory_brief": "Câu điều kiện loại 1 (First Conditional): If + S + V(present simple), S + will + V. Dùng để nói về điều có thể xảy ra trong tương lai nếu điều kiện được thực hiện. Dùng để nói về bảo vệ môi trường.",
        "theory_examples": [
            "If we recycle, we will save the environment. (Nếu tái chế, chúng ta sẽ cứu môi trường.)",
            "If you reuse bottles, you will reduce waste. (Nếu dùng lại chai, bạn sẽ giảm rác.)",
            "If we plant trees, the air will be cleaner. (Nếu trồng cây, không khí sẽ sạch hơn.)",
            "If they turn off lights, they will save energy. (Nếu tắt đèn, họ sẽ tiết kiệm năng lượng.)"
        ]
    },
    {
        "id": "g6-unit-12-robots",
        "title": "Unit 12: Robots - Will be able to & Could/Couldn't",
        "subtitle": "Will be able to & Past Ability",
        "grammar_topics": ["Will be able to", "Could/Couldn't", "Robot Vocabulary"],
        "theory_brief": "Will be able to + V: sẽ có thể làm gì (khả năng trong tương lai). Could + V: đã có thể làm gì (khả năng trong quá khứ). Couldn't + V: không thể làm gì (quá khứ). Dùng để nói về khả năng của robot.",
        "theory_examples": [
            "Robots will be able to do housework. (Robot sẽ có thể làm việc nhà.)",
            "Future robots will be able to talk. (Robot tương lai sẽ có thể nói chuyện.)",
            "I could swim when I was 5. (Tôi đã có thể bơi khi 5 tuổi.)",
            "She couldn't ride a bike last year. (Cô ấy không thể đi xe đạp năm ngoái.)"
        ]
    }
]

REVIEW_CONFIG = [
    {
        "id": "g6-review-1-units-1-3",
        "title": "Review 1: Units 1-3",
        "subtitle": "Present Simple, Present Continuous, There is/are",
        "units_covered": "1-3"
    },
    {
        "id": "g6-review-2-units-4-6",
        "title": "Review 2: Units 4-6",
        "subtitle": "Comparatives, Must/Mustn't, Will/Won't",
        "units_covered": "4-6"
    },
    {
        "id": "g6-review-3-units-7-9",
        "title": "Review 3: Units 7-9",
        "subtitle": "Conjunctions, Past Simple, Superlatives",
        "units_covered": "7-9"
    }
]

def create_html_template(unit_config):
    """Create HTML file content"""
    unit_id = unit_config["id"]
    title = unit_config["title"]
    subtitle = unit_config["subtitle"]

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grade 6 - {title} | English Grammar Games</title>
  <meta name="description" content="Practice {subtitle} for Grade 6">

  <!-- Shared Styles -->
  <link rel="stylesheet" href="../css/shared.css">
</head>
<body>
  <!-- Game Header -->
  <header class="game-header">
    <div class="container">
      <div class="game-header__container">
        <div class="game-header__info-section">
          <h1 class="game-header__title">Grade 6 - {title.split(' - ')[0]}</h1>
          <p class="game-header__subtitle">{subtitle}</p>
          <div class="game-info">
            <div class="game-info__item">
              <span class="game-info__label">Giáo viên:</span>
              <span class="game-info__value">Nguyễn Minh Nhựt</span>
            </div>
            <div class="game-info__item">
              <span class="game-info__label">Học sinh:</span>
              <span class="game-info__value">Trần Gia Hưng - Lớp 6</span>
            </div>
          </div>
        </div>

        <div class="game-header__stats">
          <div class="stat">
            <span class="stat__label">Điểm</span>
            <span class="stat__value stat__value--primary" id="current-score">⭐ 0</span>
          </div>

          <div class="stat">
            <span class="stat__label">Tiến độ</span>
            <span class="stat__value" id="progress-count">0 / 0</span>
          </div>

          <div class="stat" id="combo-display" style="display: none;">
            <span class="stat__label">Combo</span>
            <span class="stat__value" id="combo-count">0</span>
          </div>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="progress">
        <div class="progress__bar" id="progress-bar" style="width: 0%;"></div>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="container">
    <!-- Theory Panel (Collapsible) -->
    <div class="theory-panel" id="theory-panel">
      <button class="theory-panel__toggle" id="theory-toggle">
        <span>📖 Tài liệu ngữ pháp</span>
        <span class="theory-panel__icon" id="theory-icon">▼</span>
      </button>

      <div class="theory-panel__content" id="theory-content">
        <!-- Theory content will be loaded from JSON -->
        <p>Loading grammar theory...</p>
      </div>
    </div>

    <!-- Exercise Container -->
    <div id="exercise-container">
      <!-- Exercises will be rendered here dynamically -->
      <div class="card text-center">
        <h2>Loading...</h2>
        <p>Please wait while we load the exercises.</p>
      </div>
    </div>
  </main>

  <!-- Core JavaScript (loaded first) -->
  <script src="../js/core/utils.js"></script>
  <script src="../js/core/storage.js"></script>
  <script src="../js/core/telegram-sender.js"></script>
  <script src="../js/core/game-engine.js"></script>

  <!-- Exercise Type Handlers (mobile-friendly types only) -->
  <script src="../js/exercises/fill-blank.js"></script>
  <script src="../js/exercises/multiple-choice.js"></script>
  <script src="../js/exercises/word-rearrange.js"></script>

  <!-- Initialize Game -->
  <script>
    const UNIT_ID = '{unit_id}';
    const DATA_PATH = '../data/{unit_id}.json';

    // Theory panel toggle
    const theoryToggle = document.getElementById('theory-toggle');
    const theoryContent = document.getElementById('theory-content');
    const theoryIcon = document.getElementById('theory-icon');

    theoryToggle.addEventListener('click', () => {{
      const isExpanded = theoryContent.classList.contains('theory-panel__content--expanded');

      if (isExpanded) {{
        theoryContent.classList.remove('theory-panel__content--expanded');
        theoryIcon.classList.remove('theory-panel__icon--rotated');
      }} else {{
        theoryContent.classList.add('theory-panel__content--expanded');
        theoryIcon.classList.add('theory-panel__icon--rotated');
      }}
    }});

    // Combo display logic
    function updateComboDisplay() {{
      const comboDisplay = document.getElementById('combo-display');
      const comboCount = document.getElementById('combo-count');
      const state = GameEngine.getState();

      if (state.comboCount >= 3) {{
        comboDisplay.style.display = 'flex';
        comboCount.textContent = state.comboCount + 'x 🔥';
      }} else {{
        comboDisplay.style.display = 'none';
      }}
    }}

    // Override GameEngine.updateUI to include combo display
    const originalUpdateUI = GameEngine.updateUI.bind(GameEngine);
    GameEngine.updateUI = function() {{
      originalUpdateUI();
      updateComboDisplay();
    }};

    // Load unit data and start game
    async function loadAndStartGame() {{
      try {{
        const response = await fetch(DATA_PATH);

        if (!response.ok) {{
          throw new Error(`Failed to load data: ${{response.status}}`);
        }}

        const unitData = await response.json();

        console.log('Unit data loaded:', unitData);
        console.log('Registered exercise handlers:', Object.keys(GameEngine.exerciseHandlers));

        GameEngine.init(unitData, UNIT_ID);

      }} catch (error) {{
        console.error('Error loading game data:', error);

        const container = document.getElementById('exercise-container');
        container.innerHTML = `
          <div class="card">
            <h2 style="color: var(--danger);">Error Loading Game</h2>
            <p>Sorry, we couldn't load the exercise data. Please try refreshing the page.</p>
            <p style="font-size: var(--font-size-sm); color: var(--text-light);">Error: ${{error.message}}</p>
            <button class="btn btn--primary mt-2" onclick="location.reload()">Reload Page</button>
          </div>
        `;
      }}
    }}

    // Start game when page loads
    if (document.readyState === 'loading') {{
      document.addEventListener('DOMContentLoaded', loadAndStartGame);
    }} else {{
      loadAndStartGame();
    }}
  </script>
</body>
</html>
"""

# Note: This script provides the template. Full JSON generation would require specific exercises for each unit.
# For production, you would add specific exercise generation logic here.

print("Grade 6 Units Generator Script")
print(f"This script will generate {len(UNITS_CONFIG)} units and {len(REVIEW_CONFIG)} reviews")
print("Units to generate:", [u["id"] for u in UNITS_CONFIG])
print("Reviews to generate:", [r["id"] for r in REVIEW_CONFIG])
