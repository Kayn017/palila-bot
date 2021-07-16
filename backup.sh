#!/bin/bash

FOLDERS_TO_SAVE=("config" "guilds" "log" "resources")

if [ $# -eq 0 ]
then 
	echo "Missing argument"
	exit 1
fi

BACKUP_PATH=$(realpath $1)
WD=$(pwd)

if [ ! -d "$BACKUP_PATH" ]
then
	echo "The given folder doesn't exist"
	exit 1
fi

echo "Backup destination: $BACKUP_PATH"

if [ ! -d "$BACKUP_PATH/temp" ]
then
	mkdir "$BACKUP_PATH/temp"

	if [ $? -eq 0 ]
	then
		echo "$BACKUP_PATH/temp folder create"
	else
		echo "Error during the creation of the folder $BACKUP_PATH/temp"
		exit 1
	fi
fi

echo "Start backup"
for folder in ${FOLDERS_TO_SAVE[@]}
do
	echo " - $folder"
	cp -r "$folder" "$BACKUP_PATH/temp/$folder"

	if [ $? -ne 0 ]
	then
		echo "Error during the backup"
		exit 1
	fi
done
echo "Backup end"

echo "Zip backup..."
NOW=$(date +"%H-%M-%d-%m-%y")
ZIP_NAME="$BACKUP_PATH/backup_palilabot_$NOW.zip"
echo "Backup filename : $ZIP_NAME"

cd "$BACKUP_PATH/temp"
zip -qr "$ZIP_NAME" *

if [ $? -ne 0 ]
then
	echo "Error during the creation of the zip file"
	exit 1
fi

cd "$WD"
rm -r "$BACKUP_PATH/temp"
echo "Done"
exit 0