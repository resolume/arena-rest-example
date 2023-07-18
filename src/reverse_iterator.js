function array_reverse_iterator(input) {
    let index = input.length;

    const reverse_iterator = {
        next() {
            // move to the next logical element
            // (which happens to be the previous)
            index--;

            // are we still in range?
            if (index < 0) {
                return {
                    value: undefined,
                    done: true,
                }
            } else {
                return{ 
                    value: input[index],
                    done: false,
                }
            }
        }
    };

    return reverse_iterator;
}

export default array_reverse_iterator;
