########################
#
# Delta project.
#
# Authors:
# Lexington Whalen (@lxaw)
# Carter Marlowe (@Cmarlowe132)
# Vince Kolb-LugoVince (@vancevince) 
# Blake Seekings (@j-blake-s)
# Naveen Chithan (@nchithan)
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
import shutil

# for add to org
from organizations.models import Organization

User = get_user_model()

# File model
# folders are also files
class File(models.Model):
    # user who created the file
    author = models.ForeignKey(
        User,related_name="files", on_delete = models.CASCADE,
        null=True
    )
    # SEE: https://stackoverflow.com/questions/53058631/foreignkey-object-has-no-attribute

    # file path is path that server knows
    # note that file paths MUST be unique, names not so much
    file_path= models.TextField(db_column='file_path',blank=True,null=True,unique=True)

    # file name not necessarily same as path
    file_name = models.TextField(db_column="file_name",blank=False,null=False,)

    # original file name at upload
    original_file_name = models.TextField(blank=True,null=True,unique=False)

    # timestamp of creation
    timestamp= models.DateTimeField(auto_now_add=True)

    description = models.TextField(blank=True,default="")

    is_public = models.BooleanField(default=False)

    is_public_orgs = models.BooleanField(default=False)

    # number of times the file has been downloaded
    download_count = models.IntegerField(default=0)

    # the organizations the file is under
    registered_organizations = models.ManyToManyField(Organization,blank=True,related_name="uploaded_files")

    class Meta:
        unique_together = ('author','file_path')

    def __str__(self):
        return self.file_name
    
    def save(self,*args,**kwargs):
        # if no file name given, give it the file name generated from the file path
        # 
        if not self.file_name:
            self.file_name = str(os.path.basename(self.file_path))
        super().save(*args,**kwargs)

# when delete the File model, should also delete the file in the directory
# see: https://stackoverflow.com/questions/71278989/how-to-call-a-function-when-you-delete-a-model-object-in-django-admin-page-or
@receiver(post_delete,sender=File)
def on_delete_csv(sender,instance,using,**kwargs):
    # delete the file
    if(instance.file_path and os.path.exists(instance.file_path)):
        # shutil.rmtree(instance.file_path)
        pass
        # TODO
        # to prevent folders without any items, perhaps should check if 
        # folder empty after deletion, then 
        # delete if necessary.

class BaseTag(models.Model):
    # tag text
    text = models.CharField(max_length = 100,null=False)
    pub_date = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True

# FileTag model
# The FileTag model holds the information about the tags of the CSV file. 
# This involves the text of the tag.
class TagCsvFile(BaseTag):
    file = models.ForeignKey(File,on_delete = models.CASCADE,related_name="tag_set",null=True,blank=True)

    def __str__(self):
        return "Tag {}".format(self.text)