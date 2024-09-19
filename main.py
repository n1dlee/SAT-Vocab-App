import eel
import random

eel.init('web')

def load_words(filename):
    word_definitions = {}
    with open(filename, 'r', encoding='utf-8') as file:
        for line in file:
            word, definition = line.strip().split(' - ')
            word_definitions[word] = definition
    return word_definitions

word_definitions = load_words('web/words.txt')

@eel.expose
def get_question(mode):
    word = random.choice(list(word_definitions.keys()))
    definition = word_definitions[word]
    
    if mode == 'word_to_definition':
        options = [definition]
        while len(options) < 4:
            random_definition = random.choice(list(word_definitions.values()))
            if random_definition not in options:
                options.append(random_definition)
        random.shuffle(options)
        return {'word': word, 'options': options}
    elif mode == 'definition_to_word':
        options = [word]
        while len(options) < 4:
            random_word = random.choice(list(word_definitions.keys()))
            if random_word not in options:
                options.append(random_word)
        random.shuffle(options)
        return {'definition': definition, 'options': options}
    else:  # mode == 'definition_to_input'
        return {'definition': definition, 'word': word}

@eel.expose
def check_answer(mode, question, answer):
    if mode == 'word_to_definition':
        return answer == word_definitions[question]
    elif mode == 'definition_to_word':
        return answer == next(word for word, definition in word_definitions.items() if definition == question)
    else:  # mode == 'definition_to_input'
        return answer.lower() == question.lower()

if __name__ == "__main__":
    eel_kwargs = {
        'size': (1920, 1080),
        'mode': 'chrome',
        'chrome_command_line_flags': [
            '--start-fullscreen',
            '--kiosk',
            '--disable-background-timer-throttling',
            '--disable-background-networking',
            '--disable-extensions',
            '--disable-translate',
            '--no-first-run',
            '--disable-gpu',
            '--no-sandbox',
            '--disable-features=TranslateUI',
            '--disable-dev-shm-usage'
        ],
    }
    eel.start('index.html', **eel_kwargs)