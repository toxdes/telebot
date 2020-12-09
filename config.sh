####################################################
# Fill in these fields, and use `source config.sh`# 
###################################################


# Create a bot account from BotFather in Telegram, and get the bot token
export BOT_TOKEN="TELEGRAM_BOT_TOKEN_HERE"

# Username of your bot
export BOT_USERNAME="TELEGRAM_BOT_USERNAME_HERE"

# UserID of the bot
export BOT_USERID="TELEGRAM_BOT_USERID_HERE"

# Since the bot will archive movies ratings in a channel, you should manually create a new channel and add our bot to it, so it has permissions to post messages to this channel.
# Add that target channel username here
export CHANNEL_USERNAME="TELEGRAM_CHANNEL_USERNAME_HERE"

# Bot uses Postgresql Database, so link to that database here. 
export DATABASE_URL="POSTGRES_DB_URL_HERE"

# Usually it's convenient have two differend databases for development and production.
# so if you want to develop this bot locally, uncomment the following line, and add another Postgres database URL here. 

# export DEV_DATABASE_URL="POSTGRES_DEVELOPMENT_DB_URL_HERE"