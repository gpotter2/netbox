from django import forms
from django.utils.translation import gettext_lazy as _


__all__ = (
    'DeviceLayoutWidget',
)

class DeviceLayoutWidget(forms.TextInput):
    """
    A custom Widget to prompt for device layout
    """
    template_name = "dcim/devicetype/device_layout_widget.html"
