########################
#
# Delta project.
#
# models.py
#
# Stores all the information related to the models of `data` app.
#
from django.conf import settings
from django.db import models
from django.utils import timezone

# signal when the model is deleted
# see: https://stackoverflow.com/questions/71278989/how-to-call-a-function-when-you-delete-a-model-object-in-django-admin-page-or
from django.db.models.signals import post_delete
from django.dispatch import receiver

# TODO: Change to our custom user model.
from django.contrib.auth import get_user_model

# for file manip
import os

# for add to org
from organizations.models import Organization

# cart
from accounts.models import Cart

User = get_user_model()

class DataSet(models.Model):
    # user who created dataset
    author = models.ForeignKey(
        User,related_name="datasets", on_delete = models.CASCADE,
        null=True
    )

    is_public = models.BooleanField(default=False)

    is_public_orgs = models.BooleanField(default=False)

    # number of times the file has been downloaded
    download_count = models.IntegerField(default=0)

    # timestamp of creation
    timestamp= models.DateTimeField(default=timezone.now)

    description = models.TextField(blank=True,default="")
    # the organizations the file is under
    registered_organizations = models.ManyToManyField(Organization,blank=True,related_name="uploaded_datasets")

    name = models.CharField(max_length=128)
    original_name = models.CharField(max_length=128)

    num_files = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
    def get_zip_path(self):
        return f'static/users/{self.author}/files/{self.original_name}.zip'
    
    def get_folder_path(self):
        return f'static/users/{self.author}/files/{self.original_name}/'
    
    def get_zip_file_name(self):
        return self.name + ".zip"

# File model
# folders are also files
class File(models.Model):
    dataset = models.ForeignKey(DataSet,related_name="files",on_delete = models.CASCADE,null=True)

    # file path is path that server knows
    # note that file paths MUST be unique, names not so much
    file_path= models.TextField(db_column='file_path',blank=True,null=True,unique=True)

    # file name not necessarily same as path
    file_name = models.TextField(db_column="file_name",blank=False,null=False,unique=False)

    def __str__(self):
        return self.file_name
    
    def save(self,*args,**kwargs):
        # if no file name given, give it the file name generated from the file path
        # 
        if not self.file_name:
            self.file_name = str(os.path.basename(self.file_path))
        super().save(*args,**kwargs)
    
    def in_folder(self):
        # check if within a folder
        return len(os.path.splitext(self.file_path)) > 1

# when delete the DataSet model, should also delete the files in the directory
# see: https://stackoverflow.com/questions/71278989/how-to-call-a-function-when-you-delete-a-model-object-in-django-admin-page-or
@receiver(post_delete,sender=DataSet)
def on_delete_csv(sender,instance,using,**kwargs):
    # delete the file
    if os.path.exists(instance.get_zip_path()):
        os.remove(instance.get_zip_path())
class BaseTag(models.Model):
    # tag text
    text = models.CharField(max_length = 100,null=False)
    timestamp= models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True

# FileTag model
# The FileTag model holds the information about the tags of the CSV file. 
# This involves the text of the tag.
class TagDataset(BaseTag):
    dataset = models.ForeignKey(DataSet,on_delete = models.CASCADE,related_name="tag_set",null=True,blank=True)

    def __str__(self):
        return "Tag {}".format(self.text)