bootstrapValidate(['#firstname-input', '#lastname-input', '#shop-name-input'], 'alpha:Please enter a valid name.')
bootstrapValidate(['#tel-input', '#shop-tel-input'], 'min:8:A valid telephone number must be 8 digits.|integer:A telephone number cannot contain any alphabetical characters.')
bootstrapValidate(['#email-input', '#shop-email-input'], 'email:Please enter a valid e-mail address.')
bootstrapValidate('#shop-type-input', 'alpha:Please enter a valid shop type.')
bootstrapValidate('#shop-province-input', 'alpha:Please enter a valid province.')
bootstrapValidate('#telcode-input', 'min:4:A valid post code must be 4 digits.|integer:A post code cannot contain any alphabetical characters.')