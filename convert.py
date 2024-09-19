import re

def format_definitions(text):
    lines = text.split('\n')
    formatted_lines = []
    current_word = None
    current_definition = []

    for line in lines:
        line = line.strip()
        if not line:
            continue

        # Check if line starts with a word (alphabetic characters only, possibly with hyphens)
        if re.match(r'^[a-z-]+$', line, re.IGNORECASE):
            # If we have a previous word and definition, add it to the formatted lines
            if current_word and current_definition:
                formatted_lines.append(f"{current_word} - {' '.join(current_definition)}")
            
            # Start a new word
            current_word = line
            current_definition = []
        elif current_word:
            # Continue the current definition
            current_definition.append(line)

    # Add the last word and definition
    if current_word and current_definition:
        formatted_lines.append(f"{current_word} - {' '.join(current_definition)}")

    return '\n'.join(formatted_lines)

def process_file(input_file, output_file):
    try:
        # Read the input file
        with open(input_file, 'r', encoding='utf-8') as file:
            input_text = file.read()

        # Format the definitions
        formatted_text = format_definitions(input_text)

        # Write to the output file
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(formatted_text)

        print(f"Successfully processed {input_file} and created {output_file}")
    except FileNotFoundError:
        print(f"Error: The file {input_file} was not found.")
    except IOError as e:
        print(f"An error occurred while processing the files: {e}")

# Use the function
process_file('words.txt', 'vocabulary.txt')