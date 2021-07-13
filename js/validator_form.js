function Validator (option) {
    var objectRules = {};
    // Hàm kiểm tra lỗi
    function validate (inputElement, rules) {
        var errorElement = inputElement.parentElement.querySelector(option.errorTag);
        var textError;
        var rulesElement = objectRules[rules.selector];
        for (var i = 0; i < rulesElement.length; i++) {
            textError = rulesElement[i](inputElement.value);
            if (textError) break;
        }
        // console.lolg(textError);
        // console.log(inputElement.paren8tElement.querySelector('.form-message'));
        if (textError) {
            errorElement.innerText = textError;
            // console.log(errorElement);
            inputElement.parentElement.classList.add('invalid');
        } else {
            errorElement.innerText = '';
            // console.log(errorElement);
            inputElement.parentElement.classList.remove('invalid');
        }
        return textError;
    }
    // Hàm tìm các thẻ input
    var formElement = document.querySelector(option.form);
    if (formElement) {
        option.rule.forEach(function (rules) {
            // Lưu các Rules vào Array
           if (Array.isArray(objectRules[rules.selector])) {
               objectRules[rules.selector].push(rules.test);
           } else {
               objectRules[rules.selector] = [rules.test];
           }
            // console.log(objectRules[rules.selector]);
            var inputElement = formElement.querySelector(rules.selector);
            // console.log(inputElement);
            if (inputElement) {
                // Xử lý khi blur các thẻ input
                inputElement.onblur = function() {
                   validate(inputElement, rules); 
                
                }
                inputElement.onfocus = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message');
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        }); 
        // console.log(objectRules);
        formElement.onsubmit = function (e) {
            e.preventDefault();
            var dataSubmit = true;
            option.rule.forEach(function (rules) {
            var inputElement = formElement.querySelector(rules.selector);
            var isError = validate(inputElement,rules);
            // console.log(isError);
            if (isError) {
                dataSubmit = false;
            }
            });
            if (dataSubmit) {
                if (typeof option.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        values[input.name] = input.value;
                        return values;
                    }, {});
                    option.onSubmit(formValues);
                } 
                else {
                    formElement.submit();
                }
            }
        }
    }
}
Validator.isRequired = function(selector, alarm){
    return {
        selector: selector,
        test: function(value){
            return value ? undefined : alarm || 'Vui lòng điền thông tin';
        }
    }
}
Validator.isEmail = function(selector, alarm){
    return {
        selector: selector,
        test: function(value){
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            return regex.test(value) ? undefined :  alarm || 'Đây không phải là Email'
        }
    }
}
Validator.isPassword = function (selector, min, alarm) {
    return {
        selector: selector,
        test: function(value){
            return value.length >= min ? undefined :  alarm ||`Vui lòng nhập trên ${min} ký tự`
        }
    }
}
Validator.isConfirmed = function (selector, getConfirm, alarm) {
    return {
        selector: selector,
        test: function(value){
            return value === getConfirm() ? undefined :  alarm ||'Vui lòng nhập lại đúng mật khẩu'
        }
    }
}
