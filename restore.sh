#!/bin/bash

if [ $# -eq 0 ]
then 
	echo "Missing argument"
	exit 1
fi

BACKUP_FILE=$1
WD=$(dirname "$(realpath $BASH_SOURCE)")

if [ ! -e $BACKUP_FILE ]
then
	echo "The given file doesn't exist"
	exit 1
fi

echo "Backup file: $BACKUP_FILE"

if [ ! -d "$WD/temp" ]
then
	mkdir "$WD/temp"

	if [ $? -eq 0 ]
	then
		echo "$WD/temp folder create"
	else
		echo "Error during the creation of the folder $WD/temp"
		exit 1
	fi
fi

echo "Unzipping file..."
unzip -q $BACKUP_FILE -d "$WD/temp"

if [ $? -ne 0 ]
then
	echo "Error during the creation of the zip file"
	exit 1
fi

echo "Unzip end"
echo "Restoring folder"

FOLDERS_TO_RESTORE=$(ls "$WD/temp")

for folder in $FOLDERS_TO_RESTORE
do
	echo " - $folder to $WD/$folder"

	if [ -d "$WD/$folder" ]
	then 
		rm -r "$WD/$folder"
	fi
	
	cp -r "$WD/temp/$folder" "$WD/$folder"

done

rm -r "$WD/temp"
echo "Done"
exit 0